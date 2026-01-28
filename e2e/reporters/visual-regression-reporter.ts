import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Custom Visual Regression Reporter
 * 
 * Provides enhanced reporting with:
 * - Performance metrics
 * - Visual diff statistics
 * - Detailed failure analysis
 * - Markdown summary report
 */
export class VisualRegressionReporter implements Reporter {
  private startTime: number = 0;
  private tests: Array<{
    name: string;
    file: string;
    duration: number;
    status: string;
    project: string;
    snapshots: number;
    retries: number;
  }> = [];
  private failedTests: Array<{
    name: string;
    file: string;
    error: string;
    project: string;
  }> = [];

  onBegin() {
    this.startTime = Date.now();
    console.log('\n🎨 Visual Regression Tests Starting...\n');
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const testInfo = {
      name: test.title,
      file: path.relative(process.cwd(), test.location.file),
      duration: result.duration,
      status: result.status,
      project: test.parent.project()?.name || 'default',
      snapshots: result.attachments.filter(a => a.name.includes('screenshot')).length,
      retries: result.retry,
    };

    this.tests.push(testInfo);

    if (result.status === 'failed' || result.status === 'timedOut') {
      this.failedTests.push({
        name: test.title,
        file: testInfo.file,
        error: result.error?.message || 'Unknown error',
        project: testInfo.project,
      });
    }

    // Real-time progress
    const icon = result.status === 'passed' ? '✓' : result.status === 'failed' ? '✗' : '⊘';
    const color = result.status === 'passed' ? '\x1b[32m' : result.status === 'failed' ? '\x1b[31m' : '\x1b[33m';
    console.log(`${color}${icon}\x1b[0m ${testInfo.project} › ${test.title} (${result.duration}ms)`);
  }

  async onEnd(result: FullResult) {
    const totalTime = Date.now() - this.startTime;
    const passed = this.tests.filter(t => t.status === 'passed').length;
    const failed = this.tests.filter(t => t.status === 'failed' || t.status === 'timedOut').length;
    const skipped = this.tests.filter(t => t.status === 'skipped').length;
    const flaky = this.tests.filter(t => t.status === 'passed' && t.retries > 0).length;

    // Console summary
    console.log('\n' + '═'.repeat(60));
    console.log('🎨 Visual Regression Test Summary');
    console.log('═'.repeat(60));
    console.log(`✓ Passed:  ${passed}`);
    if (failed > 0) console.log(`✗ Failed:  ${failed}`);
    if (skipped > 0) console.log(`⊘ Skipped: ${skipped}`);
    if (flaky > 0) console.log(`⚠ Flaky:   ${flaky}`);
    console.log(`⏱ Duration: ${(totalTime / 1000).toFixed(2)}s`);
    console.log('═'.repeat(60) + '\n');

    // Performance metrics
    const avgDuration = this.tests.reduce((sum, t) => sum + t.duration, 0) / this.tests.length;
    const slowest = [...this.tests].sort((a, b) => b.duration - a.duration).slice(0, 5);
    
    console.log('📊 Performance Metrics:');
    console.log(`   Average test duration: ${avgDuration.toFixed(0)}ms`);
    console.log(`   Slowest tests:`);
    slowest.forEach((t, i) => {
      console.log(`     ${i + 1}. ${t.name} - ${t.duration}ms`);
    });
    console.log('');

    // Generate markdown report
    await this.generateMarkdownReport(totalTime, passed, failed, skipped, flaky);

    // Generate JSON report for CI
    await this.generateJSONReport(totalTime, passed, failed, skipped);
  }

  private async generateMarkdownReport(
    totalTime: number,
    passed: number,
    failed: number,
    skipped: number,
    flaky: number
  ) {
    const reportPath = path.join(process.cwd(), 'test-results', 'visual-report.md');
    
    let content = `# Visual Regression Test Report

Generated: ${new Date().toISOString()}

## Summary

| Metric | Value |
|--------|-------|
| ✓ Passed | ${passed} |
| ✗ Failed | ${failed} |
| ⊘ Skipped | ${skipped} |
| ⚠ Flaky | ${flaky} |
| ⏱ Duration | ${(totalTime / 1000).toFixed(2)}s |
| 📸 Total Screenshots | ${this.tests.reduce((sum, t) => sum + t.snapshots, 0)} |

## Performance Metrics

| Test | Duration | Project |
|------|----------|---------|
`;

    const slowest = [...this.tests].sort((a, b) => b.duration - a.duration).slice(0, 10);
    slowest.forEach(t => {
      content += `| ${t.name} | ${t.duration}ms | ${t.project} |\n`;
    });

    if (this.failedTests.length > 0) {
      content += `\n## Failed Tests\n\n`;
      this.failedTests.forEach(t => {
        content += `### ❌ ${t.name}\n`;
        content += `- **File:** \`${t.file}\`\n`;
        content += `- **Project:** ${t.project}\n`;
        content += `- **Error:** ${t.error.split('\n')[0]}\n\n`;
      });
    }

    content += `\n## Commands

\`\`\`bash
# View detailed report
pnpm test:visual:report

# Update baselines
pnpm test:visual:update

# Run failed tests only
npx playwright test --last-failed
\`\`\`
`;

    await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.promises.writeFile(reportPath, content, 'utf-8');
    
    console.log(`📄 Detailed report: ${reportPath}\n`);
  }

  private async generateJSONReport(
    totalTime: number,
    passed: number,
    failed: number,
    skipped: number
  ) {
    const reportPath = path.join(process.cwd(), 'test-results', 'visual-metrics.json');
    
    const avgDuration = this.tests.reduce((sum, t) => sum + t.duration, 0) / this.tests.length;
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.tests.length,
        passed,
        failed,
        skipped,
        duration: totalTime,
      },
      metrics: {
        avgDuration: Math.round(avgDuration),
        totalScreenshots: this.tests.reduce((sum, t) => sum + t.snapshots, 0),
        slowestTests: [...this.tests]
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 10)
          .map(t => ({
            name: t.name,
            duration: t.duration,
            project: t.project,
          })),
      },
      tests: this.tests,
      failedTests: this.failedTests,
    };

    await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  }
}

export default VisualRegressionReporter;

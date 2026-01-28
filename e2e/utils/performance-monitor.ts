import * as fs from 'fs';
import * as path from 'path';

/**
 * Performance Monitoring Utilities
 * 
 * Track and analyze visual test performance over time
 */

export interface PerformanceMetrics {
  timestamp: string;
  totalTests: number;
  totalDuration: number;
  avgDuration: number;
  passRate: number;
  slowestTests: Array<{
    name: string;
    duration: number;
  }>;
}

export class PerformanceMonitor {
  private metricsFile: string;
  private maxHistory: number = 50;

  constructor(metricsFile: string = './test-results/performance-history.json') {
    this.metricsFile = path.resolve(process.cwd(), metricsFile);
  }

  /**
   * Load historical metrics
   */
  async loadHistory(): Promise<PerformanceMetrics[]> {
    try {
      const content = await fs.promises.readFile(this.metricsFile, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  /**
   * Save metrics to history
   */
  async saveMetrics(metrics: PerformanceMetrics): Promise<void> {
    const history = await this.loadHistory();
    history.push(metrics);

    // Keep only last N entries
    if (history.length > this.maxHistory) {
      history.splice(0, history.length - this.maxHistory);
    }

    await fs.promises.mkdir(path.dirname(this.metricsFile), { recursive: true });
    await fs.promises.writeFile(
      this.metricsFile,
      JSON.stringify(history, null, 2),
      'utf-8'
    );
  }

  /**
   * Analyze performance trends
   */
  async analyzeTrends(): Promise<{
    avgDurationTrend: 'improving' | 'degrading' | 'stable';
    passRateTrend: 'improving' | 'degrading' | 'stable';
    recentAvgDuration: number;
    historicalAvgDuration: number;
  }> {
    const history = await this.loadHistory();
    
    if (history.length < 5) {
      return {
        avgDurationTrend: 'stable',
        passRateTrend: 'stable',
        recentAvgDuration: 0,
        historicalAvgDuration: 0,
      };
    }

    const recent = history.slice(-5);
    const historical = history.slice(-20, -5);

    const recentAvgDuration = recent.reduce((sum, m) => sum + m.avgDuration, 0) / recent.length;
    const historicalAvgDuration = historical.reduce((sum, m) => sum + m.avgDuration, 0) / historical.length;
    
    const recentPassRate = recent.reduce((sum, m) => sum + m.passRate, 0) / recent.length;
    const historicalPassRate = historical.reduce((sum, m) => sum + m.passRate, 0) / historical.length;

    const durationChange = (recentAvgDuration - historicalAvgDuration) / historicalAvgDuration;
    const passRateChange = (recentPassRate - historicalPassRate) / historicalPassRate;

    return {
      avgDurationTrend: 
        durationChange < -0.1 ? 'improving' : 
        durationChange > 0.1 ? 'degrading' : 
        'stable',
      passRateTrend:
        passRateChange > 0.05 ? 'improving' :
        passRateChange < -0.05 ? 'degrading' :
        'stable',
      recentAvgDuration: Math.round(recentAvgDuration),
      historicalAvgDuration: Math.round(historicalAvgDuration),
    };
  }

  /**
   * Generate performance report
   */
  async generateReport(): Promise<string> {
    const history = await this.loadHistory();
    const trends = await this.analyzeTrends();

    if (history.length === 0) {
      return 'No performance data available yet.';
    }

    const latest = history[history.length - 1];

    let report = `
# Visual Test Performance Report

## Current Metrics (Latest Run)
- **Total Tests:** ${latest.totalTests}
- **Total Duration:** ${(latest.totalDuration / 1000).toFixed(2)}s
- **Average Duration:** ${latest.avgDuration}ms
- **Pass Rate:** ${(latest.passRate * 100).toFixed(1)}%

## Trends (Last ${history.length} runs)
- **Duration Trend:** ${this.getTrendEmoji(trends.avgDurationTrend)} ${trends.avgDurationTrend}
  - Recent avg: ${trends.recentAvgDuration}ms
  - Historical avg: ${trends.historicalAvgDuration}ms
- **Pass Rate Trend:** ${this.getTrendEmoji(trends.passRateTrend)} ${trends.passRateTrend}

## Slowest Tests
${latest.slowestTests.map((t, i) => `${i + 1}. ${t.name} - ${t.duration}ms`).join('\n')}

## Historical Data
| Run | Duration | Avg | Pass Rate |
|-----|----------|-----|-----------|
${history.slice(-10).reverse().map(m => 
  `| ${new Date(m.timestamp).toLocaleString()} | ${(m.totalDuration / 1000).toFixed(1)}s | ${m.avgDuration}ms | ${(m.passRate * 100).toFixed(1)}% |`
).join('\n')}
`;

    return report.trim();
  }

  private getTrendEmoji(trend: 'improving' | 'degrading' | 'stable'): string {
    return trend === 'improving' ? '📈' : trend === 'degrading' ? '📉' : '➡️';
  }
}

/**
 * CLI tool to view performance trends
 */
export async function main() {
  const monitor = new PerformanceMonitor();
  const report = await monitor.generateReport();
  console.log(report);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

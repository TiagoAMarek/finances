/**
 * String similarity utilities for fuzzy matching
 * Used primarily for duplicate detection in transaction descriptions
 */

/**
 * Calculate Levenshtein distance between two strings
 * (minimum number of single-character edits needed to change one word into another)
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Distance between strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  // Create a 2D array for dynamic programming
  const dp: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  // Initialize base cases
  for (let i = 0; i <= len1; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    dp[0][j] = j;
  }

  // Fill the DP table
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // deletion
          dp[i][j - 1] + 1,     // insertion
          dp[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }

  return dp[len1][len2];
}

/**
 * Calculate similarity ratio between two strings (0-1)
 * 1 = identical, 0 = completely different
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Similarity ratio between 0 and 1
 */
export function similarityRatio(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  if (str1.length === 0 && str2.length === 0) return 1;
  if (str1.length === 0 || str2.length === 0) return 0;

  const distance = levenshteinDistance(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);
  
  return 1 - distance / maxLen;
}

/**
 * Normalize a string for comparison
 * - Converts to lowercase
 * - Removes extra whitespace
 * - Removes special characters
 * - Removes accents
 * @param str - String to normalize
 * @returns Normalized string
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, " ") // Replace special chars with space
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Calculate fuzzy similarity between two strings with normalization
 * This is the main function to use for transaction description matching
 * @param str1 - First string
 * @param str2 - Second string
 * @param normalize - Whether to normalize strings before comparing (default: true)
 * @returns Similarity score between 0 and 1
 */
export function fuzzySimilarity(
  str1: string,
  str2: string,
  normalize: boolean = true
): number {
  if (normalize) {
    str1 = normalizeString(str1);
    str2 = normalizeString(str2);
  }

  // Exact match after normalization
  if (str1 === str2) return 1;

  // Calculate base similarity
  const ratio = similarityRatio(str1, str2);

  // Bonus for substring match
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length <= str2.length ? str1 : str2;
  
  if (longer.includes(shorter) && shorter.length >= 3) {
    // Add bonus proportional to the length ratio
    // Higher bonus for longer substrings
    const lengthRatio = shorter.length / longer.length;
    const bonus = lengthRatio * 0.3;
    return Math.min(1, ratio + bonus);
  }

  // Check for common prefix (establishment name before location)
  const words1 = str1.split(" ");
  const words2 = str2.split(" ");
  
  if (words1.length > 0 && words2.length > 0) {
    const firstWord1 = words1[0];
    const firstWord2 = words2[0];
    
    // If first words match and are significant, add bonus
    if (firstWord1 === firstWord2 && firstWord1.length >= 4) {
      const bonus = 0.15;
      return Math.min(1, ratio + bonus);
    }
  }

  return ratio;
}

/**
 * Check if two strings are similar enough to be considered duplicates
 * @param str1 - First string
 * @param str2 - Second string
 * @param threshold - Minimum similarity threshold (default: 0.8)
 * @returns True if strings are similar enough
 */
export function areSimilar(
  str1: string,
  str2: string,
  threshold: number = 0.8
): boolean {
  return fuzzySimilarity(str1, str2) >= threshold;
}

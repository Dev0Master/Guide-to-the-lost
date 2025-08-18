/**
 * Advanced search utilities for fuzzy matching and improved search accuracy
 */

// Simple fuzzy matching using Levenshtein distance
export function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  
  const len1 = s1.length;
  const len2 = s2.length;
  
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  
  // Create a matrix
  const matrix: number[][] = [];
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  // Fill the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return 1 - (distance / maxLen);
}

// Check if text contains search term with fuzzy matching
export function fuzzyMatch(text: string, searchTerm: string, threshold = 0.6): boolean {
  if (!text || !searchTerm) return false;
  
  const normalizedText = text.toLowerCase().trim();
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  // Exact match
  if (normalizedText.includes(normalizedSearch)) return true;
  
  // Split into words and check each word
  const textWords = normalizedText.split(/\s+/);
  const searchWords = normalizedSearch.split(/\s+/);
  
  for (const searchWord of searchWords) {
    let bestMatch = 0;
    for (const textWord of textWords) {
      const similarity = calculateSimilarity(textWord, searchWord);
      bestMatch = Math.max(bestMatch, similarity);
    }
    if (bestMatch >= threshold) return true;
  }
  
  return false;
}

// Normalize Arabic text for better matching
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  
  return text
    // Remove diacritics
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '')
    // Normalize different forms of alef
    .replace(/[أإآا]/g, 'ا')
    // Normalize different forms of yaa
    .replace(/[يى]/g, 'ي')
    // Normalize different forms of taa marbouta
    .replace(/[ةه]/g, 'ة')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

// Enhanced search for Arabic names
export function arabicNameMatch(name: string, searchTerm: string): boolean {
  if (!name || !searchTerm) return false;
  
  const normalizedName = normalizeArabicText(name.toLowerCase());
  const normalizedSearch = normalizeArabicText(searchTerm.toLowerCase());
  
  // Exact match after normalization
  if (normalizedName.includes(normalizedSearch)) return true;
  
  // Split names and check combinations
  const nameWords = normalizedName.split(/\s+/);
  const searchWords = normalizedSearch.split(/\s+/);
  
  // Check if all search words are found in name words
  return searchWords.every(searchWord => 
    nameWords.some(nameWord => 
      nameWord.includes(searchWord) || 
      calculateSimilarity(nameWord, searchWord) >= 0.7
    )
  );
}

// Age range matching with tolerance
export function ageMatch(actualAge: number, searchAge: number, tolerance = 3): boolean {
  if (!actualAge || !searchAge) return true; // If no age criteria, don't filter
  return Math.abs(actualAge - searchAge) <= tolerance;
}

// Color matching with common variations
export function colorMatch(actualColor: string, searchColor: string): boolean {
  if (!actualColor || !searchColor) return true;
  
  const colorMappings: Record<string, string[]> = {
    // Arabic colors with variations
    'أبيض': ['ابيض', 'بيضاء', 'أبيض', 'ابيض'],
    'أسود': ['اسود', 'سوداء', 'أسود', 'اسود'],
    'أحمر': ['احمر', 'حمراء', 'أحمر', 'احمر'],
    'أزرق': ['ازرق', 'زرقاء', 'أزرق', 'ازرق'],
    'أخضر': ['اخضر', 'خضراء', 'أخضر', 'اخضر'],
    'أصفر': ['اصفر', 'صفراء', 'أصفر', 'اصفر'],
    'بني': ['بني', 'بنية', 'بنيه'],
    'رمادي': ['رمادي', 'رماديه', 'رمادية'],
    // English colors
    'white': ['white', 'cream', 'off-white'],
    'black': ['black', 'dark'],
    'red': ['red', 'crimson', 'burgundy'],
    'blue': ['blue', 'navy', 'royal blue'],
    'green': ['green', 'olive'],
    'yellow': ['yellow', 'gold'],
    'brown': ['brown', 'tan', 'beige'],
    'gray': ['gray', 'grey', 'silver'],
  };
  
  const normalizedActual = normalizeArabicText(actualColor.toLowerCase());
  const normalizedSearch = normalizeArabicText(searchColor.toLowerCase());
  
  // Direct match
  if (normalizedActual.includes(normalizedSearch) || normalizedSearch.includes(normalizedActual)) {
    return true;
  }
  
  // Check color mappings
  for (const [baseColor, variations] of Object.entries(colorMappings)) {
    const allVariations = [baseColor, ...variations];
    const actualMatches = allVariations.some(v => normalizedActual.includes(v.toLowerCase()));
    const searchMatches = allVariations.some(v => normalizedSearch.includes(v.toLowerCase()));
    
    if (actualMatches && searchMatches) {
      return true;
    }
  }
  
  return false;
}

// Calculate search relevance score
export function calculateRelevanceScore(
  person: Record<string, unknown>,
  searchCriteria: Record<string, unknown>
): number {
  let score = 0;
  let totalWeight = 0;
  
  // Name matching (weight: 40%)
  if (searchCriteria.name && person.displayName) {
    const nameWeight = 0.4;
    const nameScore = arabicNameMatch(String(person.displayName), String(searchCriteria.name)) ? 1 : 
                     fuzzyMatch(String(person.displayName), String(searchCriteria.name)) ? 0.7 : 0;
    score += nameScore * nameWeight;
    totalWeight += nameWeight;
  }
  
  // Age matching (weight: 20%)
  if (searchCriteria.age && person.age) {
    const ageWeight = 0.2;
    const ageScore = ageMatch(Number(person.age), Number(searchCriteria.age)) ? 1 : 0;
    score += ageScore * ageWeight;
    totalWeight += ageWeight;
  }
  
  // Color matching (weight: 30%)
  if (searchCriteria.clothingColor && person.clothingColor) {
    const colorWeight = 0.3;
    const colorScore = colorMatch(String(person.clothingColor), String(searchCriteria.clothingColor)) ? 1 : 0;
    score += colorScore * colorWeight;
    totalWeight += colorWeight;
  }
  
  // Location proximity (weight: 10%) - if location data available
  if (searchCriteria.location && person.coordinates) {
    const locationWeight = 0.1;
    // Simple proximity check - can be enhanced with actual distance calculation
    const locationScore = 0.5; // Placeholder
    score += locationScore * locationWeight;
    totalWeight += locationWeight;
  }
  
  return totalWeight > 0 ? score / totalWeight : 0;
}

// Main search function with improved matching
export function enhancedSearch(
  allPeople: Record<string, unknown>[],
  searchCriteria: Record<string, unknown>,
  minRelevanceScore = 0.3
): Record<string, unknown>[] {
  if (!allPeople || allPeople.length === 0) return [];
  
  // If no search criteria, return empty results
  if (!searchCriteria.name && !searchCriteria.age && !searchCriteria.clothingColor) {
    return [];
  }
  
  // Filter and score results
  const scoredResults = allPeople
    .map(person => ({
      ...person,
      relevanceScore: calculateRelevanceScore(person, searchCriteria)
    }))
    .filter(person => person.relevanceScore >= minRelevanceScore)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  return scoredResults;
}
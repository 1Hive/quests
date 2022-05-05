export function compareCaseInsensitive(str1?: string, str2?: string) {
  return str1?.toLowerCase() === str2?.toLowerCase();
}
export function includesCaseInsensitive(str: string, pattern: string) {
  return str.toLowerCase().includes(pattern.toLowerCase());
}

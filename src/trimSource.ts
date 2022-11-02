export function trimSource(code?: string): string | undefined {
  return code?.replace(/\s+/g, " ")?.trim();
}

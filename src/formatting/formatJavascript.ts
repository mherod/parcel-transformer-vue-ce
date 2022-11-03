import { prettierFormatUnsafe } from "./prettierFormatUnsafe";

export function formatJavascript(s: string): string {
  try {
    return prettierFormatUnsafe(s, "typescript");
  } catch (_) {
  }
  try {
    return prettierFormatUnsafe(s, "babel");
  } catch (_) {
  }
  return s;
}

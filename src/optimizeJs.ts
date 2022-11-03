import { formatJavascript } from "./formatJavascript";

export function optimizeJs(input: string) {
  return formatJavascript(input).trim();
}

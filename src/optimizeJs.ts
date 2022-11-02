import { formatJavascript } from "./formatJavascript";

export function optimizeJs(input) {
  return formatJavascript(input).trim();
}

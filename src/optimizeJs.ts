import { formatJavascript } from "./formatting/formatJavascript";

export function optimizeJs(input: string) {
  return formatJavascript(input).trim();
}

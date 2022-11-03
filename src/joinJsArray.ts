import { formatJavascript } from "./formatting/formatJavascript";

export function joinJsArray(...jsarray: string[]): string {
  return Array.from(jsarray).map(formatJavascript).join("\n");
}

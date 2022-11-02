import { formatJavascript } from "./formatJavascript";
import { optimizeJs } from "./optimizeJs";

export function joinJsArray(...jsarray: string[]): string {
  return optimizeJs(Array.from(jsarray).map(formatJavascript).join("\n"));
}
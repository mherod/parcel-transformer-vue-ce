import { trimSource } from "./trimSource";
import { formatLess } from "./formatLess";

export function optimizeCss(input) {
  return formatLess(input);
  // return trimSource(formatLess(input).replace(/\n+/g, " "));
}

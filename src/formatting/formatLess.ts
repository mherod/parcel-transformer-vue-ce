import * as prettier from "prettier";

export function formatLess(s: string): string {
  try {
    return prettier.format(s, { parser: "less" });
  } catch (error) {
    try {
      return prettier.format(s, { parser: "css" });
    } catch (error) {
      return s;
    }
  }
}

import * as prettier from "prettier";

export function formatJavascript(s: string): string {
  const lines = s.split("\n");
  if (lines.length > 1) {
    try {
      return prettier.format(s, { parser: "babel" });
    } catch (error) {
      return s;
    }
  } else {
    return s;
  }
}

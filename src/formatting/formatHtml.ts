// noinspection JSUnusedGlobalSymbols

import * as prettier from "prettier";

export function formatHtml(s: string): string {
  try {
    const s1 = s.replaceAll(/<[^>]+>/ig, (match) => `${match}\n`);
    return prettier.format(s1, { parser: "html" });
  } catch (error) {
    return s;
  }
}

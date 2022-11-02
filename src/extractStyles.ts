import { readFileSync } from "fs";
import { formatLess } from "./formatLess";

export async function extractStyles(filePath: string): Promise<{
  attrs: string,
  css: string
} | undefined> {
  const fileSource: string = readFileSync(filePath, "utf8");
  const regExp = /<style([^>]*)>([^<]+)<\/style>/ig;
  return Array.from(fileSource.matchAll(regExp))
    .map((match: RegExpMatchArray) => {
      return {
        attrs: match[1].trim(),
        css: formatLess(match[2].trim())
      };
    }).shift();
}

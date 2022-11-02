import { readFileSync } from "fs";

export async function extractStyles(filePath: string) {
  const fileSource: string = readFileSync(filePath, "utf8");
  let regExp = /<style[^>]*>([^<]+)<\/style>/ig;
  return Array.from(fileSource.matchAll(regExp))?.flatMap((match) => match[1])?.shift()?.trim();
}

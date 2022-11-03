import { BuiltInParserName, format } from "prettier";

export function prettierFormatUnsafe(s: string, parser: BuiltInParserName) {
  return format(s, { parser });
}

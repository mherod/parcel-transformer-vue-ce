import { formatLess } from "./formatting/formatLess";
import less from "less";

export async function optimizeCss(input: string): Promise<string> {
  let lessContent = formatLess(input);
  const output = await less.render(lessContent, {
    compress: true,
  });
  return output.css;
}

import { formatJavascript } from "./formatting/formatJavascript";
import { transpile } from "typescript";
import { minify, MinifyOutput } from "terser";

export async function optimizeJs(input: string) {
  const formattedInput: string = formatJavascript(input);
  const transpiled: string = transpile(formattedInput, {});
  const minifiedOutput: MinifyOutput = await minify(transpiled, {
    compress: {
      passes: 2
    },
    mangle: false,
    format: {
      comments: false
    }
  });
  return minifiedOutput?.code || transpiled;
}

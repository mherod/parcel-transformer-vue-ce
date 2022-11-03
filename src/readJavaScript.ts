import typescript from "typescript";
import { readFileSync } from "fs";

export function readJavaScript(path: string): string {
  return typescript.transpile(readFileSync(path, "utf8"), {
    module: typescript.ModuleKind.CommonJS,
    target: typescript.ScriptTarget.ES2015,
    inlineSources: true
  });
}

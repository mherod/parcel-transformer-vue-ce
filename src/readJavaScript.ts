import { transpile, ModuleKind, ScriptTarget } from "typescript";
import { readFileSync } from "fs";

export function readJavaScript(path: string): string {
  return transpile(readFileSync(path, "utf8"), {
    module: ModuleKind.CommonJS,
    target: ScriptTarget.ES5
  });
}

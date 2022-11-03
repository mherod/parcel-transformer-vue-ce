import { MutableAsset } from "@parcel/types";
import { extractStyles } from "./extractStyles";
import { optimizeCss } from "./optimizeCss";
import { makeJsToInjectCss } from "./makeJsToInjectCss";
import { formatJavascript } from "./formatJavascript";
import { joinJsArray } from "./joinJsArray";
import { readFileSync } from "fs";
import less from "less";

function modifyMounted(input: string, inject: string): string {
  const formattedInput = formatJavascript(input);
  // safer to format the input before we do anything with it
  //
  const s = formattedInput.replace(/mounted((\s*\(\))|(\W*function\s*\(\)))\s*[{]\s*([^}]+)\s*[}]/g, (match, fnSyntax, fnSyntaxA, fnSyntaxB, inner) => {
    return formatJavascript(`mounted${fnSyntax} { ${joinJsArray(inner, inject)} }`);
  });
  return formatJavascript(s);
}

async function renderLess(lessContent: string, filePath: string): Promise<string> {
  const output = await less.render(lessContent, { filename: filePath });
  return output?.css ?? "";
}

export async function processVueAsset(asset: MutableAsset) {
  const filePath = asset.filePath;
  const extractedStyles = await extractStyles(filePath);
  if (extractedStyles) {
    const extractedCss = extractedStyles.css;
    if (extractedCss) {
      const assetId = asset.id;
      const scoped = extractedStyles.attrs.split(" ").includes("scoped");
      const lessContent = scoped ? `[data-asset-id='${assetId}'] { ${extractedCss} }` : extractedCss;
      const css = await renderLess(lessContent, filePath);
      const formattedCss = optimizeCss(css);
      const inject = joinJsArray(
        readFileSync(__dirname + "/vueInjectJs.js", "utf8"),
        makeJsToInjectCss(formattedCss),
        `try { this.$el.setAttribute("data-asset-id", "${assetId}") } catch (e) { }`
      );
      const code = await asset.getCode() ?? "";
      const edited = code.replace(
        /<script([^>]*)>([^<]+)<\/script>/ig,
        (match, scriptAttrs, inner) => {
          const scriptEdited = modifyMounted(inner, inject);
          return `<script${scriptAttrs}>${scriptEdited}</script>`;
        });
      if (edited !== code) {
        asset.setCode(edited);
      } else {
        const codeEdited = modifyMounted(code, inject);
        if (codeEdited !== code) {
          asset.setCode(codeEdited);
        }
      }
      asset.invalidateOnFileChange(filePath);
    }
  }
  return asset;
}

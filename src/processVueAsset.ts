import { MutableAsset } from "@parcel/types";
import { extractStyles } from "./extractStyles";
import { optimizeCss } from "./optimizeCss";
import { makeJsToInjectCss } from "./makeJsToInjectCss";
import { formatJavascript } from "./formatting/formatJavascript";
import { joinJsArray } from "./joinJsArray";
import { formatHtml } from "./formatting/formatHtml";
import { renderLess } from "./renderLess";
import { readJavaScript } from "./readJavaScript";

function modifyMounted(input: string, inject: string): string {
  const formattedInput = formatJavascript(input);
  // safer to format the input before we do anything with it
  //
  const s = formattedInput.replace(/mounted((\s*\(\))|(\W*function\s*\(\)))\s*[{]\s*([^}]+\s*)[}]/g, (match, fnSyntax, fnSyntaxA, fnSyntaxB, inner) => {
    return `mounted${fnSyntax} {${joinJsArray(inject, inner)}}`;
  });
  return formatJavascript(s);
}

const processedComment = "// processed by parcel-transformer-vue-ce";

export async function processVueAsset(asset: MutableAsset) {
  const code = await asset.getCode() ?? "";
  if (code.includes(processedComment)) {
    return;
  }
  const filePath = asset.filePath;
  const extractedStyles = await extractStyles(filePath);
  if (extractedStyles) {
    const extractedCss = extractedStyles.css;
    if (extractedCss) {
      const assetId = asset.id;
      const scoped = extractedStyles.attrs.split(" ").includes("scoped");
      const lessContent = scoped ? `[data-asset-id='${assetId}'] { ${extractedCss} }` : extractedCss;
      const css = await renderLess(lessContent, filePath);
      const formattedCss = await optimizeCss(css);
      const inject = joinJsArray(
        processedComment,
        readJavaScript(__dirname + "/vueInjectJs.ts"),
        makeJsToInjectCss(formattedCss),
        `try { thisElement(this).setAttribute("data-asset-id", "${assetId}") } catch (e) { console.error(e) }`
      );
      const edited = code.replace(
        /<script([^>]*)>([^<]+)<\/script>/ig,
        (match, scriptAttrs, inner) => {
          const scriptEdited = modifyMounted(inner, inject);
          return formatHtml(`<script${scriptAttrs}>${formatJavascript(scriptEdited)}</script>`);
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
}

import { MutableAsset } from "@parcel/types";
import { extractStyles } from "./extractStyles";
import { optimizeCss } from "./optimizeCss";
import { makeJsToInjectCss } from "./makeJsToInjectCss";
import less from "less";
import { formatJavascript } from "./formatJavascript";

function modifyMounted(input, inject) {
  const formattedInput = formatJavascript(input);
  // safer to format the input before we do anything with it
  const s = formattedInput.replace(/mounted\s*\(\)\s*{\s*([^}]+)\s*}/, (match, p1) => {
    return `mounted() { ${p1} ${inject} }`;
  });
  return formatJavascript(s);
}

export async function processVueAsset(asset: MutableAsset) {
  const filePath = asset.filePath;
  const extractedStyles = await extractStyles(filePath);
  if (extractedStyles) {
    const { css } = await less.render(extractedStyles, { filename: filePath });
    const formattedCss = optimizeCss(css);
    const inject = makeJsToInjectCss(formattedCss);
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
  return asset;
}

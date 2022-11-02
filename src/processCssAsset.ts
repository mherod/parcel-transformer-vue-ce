import { MutableAsset } from "@parcel/types";
import { trimSource } from "./trimSource";

export async function processCssAsset(asset: MutableAsset, assets: MutableAsset[]) {
  const source = trimSource(await asset.getCode());
  if (source) {
    asset.setCode("");
    asset.setMap(null);
    const filePath = asset.filePath;
    asset.invalidateOnFileChange(filePath);
    // language=JavaScript
    const jsInject = `
      const style = document.createElement('style');
      style.innerHTML += \`${source}\`;
      document.head.appendChild(style);
    `;
    const trimSource1 = trimSource(jsInject);
    if (trimSource1) {
      const newJsAsset = {
        type: "js",
        content: trimSource1,
        uniqueKey: `${asset.id}-js-styles`,
        bundleBehavior: "inline"
      };
      // @ts-ignore
      assets.push(newJsAsset);
    }
  }
}

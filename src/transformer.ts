// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import { Transformer } from "@parcel/plugin";
import { MutableAsset } from "@parcel/types";
import { processVueAsset } from "./processVueAsset";
import { processCssAsset } from "./processCssAsset";

export default new Transformer({
  transform: async function({ asset }): Promise<MutableAsset[]> {
    const assets: MutableAsset[] = [asset];
    const filePath = asset.filePath;
    if (filePath.match(/\.vue$/)) {
      // console.log("Transforming " + filePath);
      if (asset.type === "css") {
        await processCssAsset(asset, assets).catch(console.error);
      }
      if (asset.type == "vue" || asset.type == "js") {
        await processVueAsset(asset).catch(console.error);
      }
    }
    if (filePath.match(/\.css$/)) {
      await processCssAsset(asset, assets).catch(console.error);
    }
    return assets;
  }
});

// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import { Transformer } from "@parcel/plugin";
import { MutableAsset, Transformer as TransformerOpts } from "@parcel/types";
import { processVueAsset } from "./processVueAsset";
import { processCssAsset } from "./processCssAsset";

type T = any;

const opts: TransformerOpts<T> = {
  transform: async function({ asset }): Promise<MutableAsset[]> {
    const assets: MutableAsset[] = [asset];
    const { filePath, type } = asset;
    if (filePath.match(/\.vue$/)) {
      if (type === "css") {
        await processCssAsset(asset, assets).catch(console.error);
      }
      if (type == "vue" || type == "js") {
        await processVueAsset(asset).catch(console.error);
      }
    }
    if (filePath.match(/\.css$/)) {
      await processCssAsset(asset, assets).catch(console.error);
    }
    return assets;
  }
};

export default new Transformer<T>(opts);

// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {Transformer} from "@parcel/plugin";
import {MutableAsset} from "@parcel/types";
import {readFileSync} from "fs";
import less from 'less';

function trimSource(code?: string): string | undefined {
    return code?.replace(/\s+/g, ' ')?.trim();
}

async function extractStyles(fileSystem, filePath: string) {
    const fileSource: string = readFileSync(filePath, 'utf8');
    let regExp = /<style[^>]*>([^<]+)<\/style>/ig;
    return Array.from(fileSource.matchAll(regExp))?.flatMap((match) => match[1])?.shift()?.trim();
}

function makeJsToInjectCss(css) {
    // language=JavaScript
    return `setTimeout(() => {
      const style = document.createElement('style');
      style.innerHTML += \`${css}\`;
      const thisElement = this.$el;
      const parentElement = thisElement.parentElement
      parentElement.insertBefore(style, thisElement);
    }, 0);`;
}

async function processVueAsset(asset: MutableAsset) {
    const fileSystem = asset.fs;
    const filePath = asset.filePath;
    const extractedStyles = await extractStyles(fileSystem, filePath);
    if (extractedStyles) {
        const {css} = await less.render(extractedStyles, {filename: filePath});
        const inject = makeJsToInjectCss(css);
        let code = await asset.getCode();
        const codeEdited = code?.replace(/mounted\s*\(\)\s*{\s*([^}]+)\s*}/, (match, p1) => {
            return `mounted() { ${p1} ${inject} }`;
        });
        asset.setCode(codeEdited);
        asset.setMap(null);
        asset.invalidateOnFileChange(filePath);
    }
    return asset;
}

async function processCssAsset(asset: MutableAsset, assets: MutableAsset[]) {
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
        `
        const trimSource1 = trimSource(jsInject);
        if (trimSource1) {
            const newJsAsset = {
                type: 'js',
                content: trimSource1,
                uniqueKey: `${asset.id}-js-styles`,
                bundleBehavior: 'inline'
            }
            // @ts-ignore
            assets.push(newJsAsset)
        }
    }
}

export default new Transformer({
    transform: async function ({asset}): Promise<MutableAsset[]> {
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
    },
});

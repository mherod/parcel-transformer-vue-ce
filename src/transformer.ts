// noinspection JSUnusedGlobalSymbols

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

export default new Transformer({
    async transform({asset}): Promise<MutableAsset[]> {
        const assets: MutableAsset[] = [asset];
        const filePath = asset.filePath;

        if (filePath.match(/\.vue$/)) {
            // console.log("Transforming " + filePath);
            const code = (await asset.getCode()) ?? "";
            if (asset.type === "css") {
                const source = trimSource(code);
                if (source) {
                    asset.setCode("");
                    asset.setMap(null);
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
            } else if (asset.type == "vue" || asset.type == "js") {
                const fileSystem = asset.fs;
                const extractedStyles = await extractStyles(fileSystem, filePath);
                if (extractedStyles) {
                    const {css} = await less.render(extractedStyles, {filename: filePath});
                    console.log(css);
                    const inject = makeJsToInjectCss(css);
                    const codeEdited = code.replace(/mounted\s*\(\)\s*{\s*([^}]+)\s*}/, (match, p1) => {
                        return `mounted() { ${p1} ${inject} }`;
                    });
                    asset.setCode(codeEdited);
                    asset.setMap(null);
                    asset.invalidateOnFileChange(filePath);
                }
            }
        }
        return assets;
    },
});

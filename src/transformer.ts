// noinspection JSUnusedGlobalSymbols

import {Transformer} from "@parcel/plugin";
import {MutableAsset} from "@parcel/types";

// const styles = [];

function trimSource(code: string) {
    return code.replace(/\s+/g, ' ').trim();
}

async function extractStyles(fileSystem, filePath: string) {
    const fileSource = await fileSystem.readFile(filePath, 'utf8');
    return Array.from(fileSource.matchAll(/<style[^>]*>([^<]+)<\/style>/ig)).flatMap((match) => match[1]).shift().trim();
}

export default new Transformer({
    async transform({asset}): Promise<MutableAsset[]> {
        const assets: MutableAsset[] = [asset];
        const filePath = asset.filePath;

        if (filePath.match(/\.vue$/)) {
            // console.log("Transforming " + filePath);
            const code = await asset.getCode();
            if (asset.type === "css") {
                const source = trimSource(code);
                asset.setCode("");
                asset.setMap(null);
                asset.invalidateOnFileChange(filePath);
                // language=JavaScript
                const jsInject = `
                  const style = document.createElement('style');
                  style.innerHTML += \`${source}\`;
                  document.head.appendChild(style);
                `
                const newJsAsset = {
                    type: 'js',
                    content: trimSource(jsInject),
                    uniqueKey: `${asset.id}-js-styles`,
                    bundleBehavior: 'inline'
                }
                // @ts-ignore
                assets.push(newJsAsset)
            } else if (asset.type == "vue" || asset.type == "js") {
                const fileSystem = asset.fs;
                const extractedStyles = await extractStyles(fileSystem, filePath);
                // language=JavaScript
                const inject = `setTimeout(() => {
  const style = document.createElement('style');
  style.innerHTML += \`${extractedStyles}\`;
  const thisElement = this.$el;
  const parentElement = thisElement.parentElement
  parentElement.insertBefore(style, thisElement);
}, 0);`
                const codeEdited = code.replace(/mounted\s*\(\)\s*{\s*([^}]+)\s*}/, (match, p1) => {
                    return `mounted() { ${p1} ${inject} }`;
                });
                asset.setCode(codeEdited);
                asset.setMap(null);
                asset.invalidateOnFileChange(filePath);
            } else {
                console.log(asset.id, asset.type, code)
            }
        }
        return assets;
    },
});

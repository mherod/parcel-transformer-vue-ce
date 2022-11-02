import {Transformer} from "@parcel/plugin";
import {MutableAsset} from "@parcel/types";
import {uniq} from "lodash";

const styles = [];

export default new Transformer({
    async transform({asset}): Promise<MutableAsset[]> {
        const assets: MutableAsset[] = [asset];
        const filePath = asset.filePath;
        console.log("Transforming " + filePath);
        if (filePath.match(/\.vue$/)) {
            if (asset.type === "css") {
                const source = await asset.getCode();
                styles.push(source);
                const joinedStyles = uniq(styles).join("");
                // language=JavaScript
                const jsInject = `
                  const existingStyle = document.querySelector("style[data-vue-styles]");
                  const style = existingStyle ?? document.createElement('style');
                  style.setAttribute("data-vue-styles", "true");
                  style.innerHTML += \`${joinedStyles}\`;
                  document.head.appendChild(style);
                `
                const newJsAsset = {
                    type: 'js',
                    content: jsInject,
                    uniqueKey: `${asset.id}-js`,
                    bundleBehavior: 'inline'
                }
                // @ts-ignore
                assets.push(newJsAsset)
            }
        }
        return assets;
    },
});

var $5qv2R$parcelplugin = require("@parcel/plugin");
var $5qv2R$lodash = require("lodash");

function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $fb373f82e41d32f1$export$2e2bcd8739ae039);


const $fb373f82e41d32f1$var$styles = [];
var $fb373f82e41d32f1$export$2e2bcd8739ae039 = new (0, $5qv2R$parcelplugin.Transformer)({
    async transform ({ asset: asset  }) {
        const assets = [
            asset
        ];
        const filePath = asset.filePath;
        console.log("Transforming " + filePath);
        if (filePath.match(/\.vue$/)) {
            if (asset.type === "css") {
                const source = await asset.getCode();
                $fb373f82e41d32f1$var$styles.push(source);
                const joinedStyles = (0, $5qv2R$lodash.uniq)($fb373f82e41d32f1$var$styles).join("");
                // language=JavaScript
                const jsInject = `
                  const existingStyle = document.querySelector("style[data-vue-styles]");
                  const style = existingStyle ?? document.createElement('style');
                  style.setAttribute("data-vue-styles", "true");
                  style.innerHTML += \`${joinedStyles}\`;
                  document.head.appendChild(style);
                `;
                const newJsAsset = {
                    type: "js",
                    content: jsInject,
                    uniqueKey: `${asset.id}-js`,
                    bundleBehavior: "inline"
                };
                // @ts-ignore
                assets.push(newJsAsset);
            }
        }
        return assets;
    }
});


//# sourceMappingURL=transformer.js.map

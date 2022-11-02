var $5qv2R$parcelplugin = require("@parcel/plugin");

function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $fb373f82e41d32f1$export$2e2bcd8739ae039);

// const styles = [];
function $fb373f82e41d32f1$var$trimSource(code) {
    return code.replace(/\s+/g, " ").trim();
}
async function $fb373f82e41d32f1$var$extractStyles(fileSystem, filePath) {
    var ref, ref1, ref2;
    const fileSource = await fileSystem.readFile(filePath, "utf8");
    let regExp = /<style[^>]*>([^<]+)<\/style>/ig;
    return (ref2 = (ref1 = (ref = Array.from(fileSource.matchAll(regExp))) === null || ref === void 0 ? void 0 : ref.flatMap((match)=>match[1])) === null || ref1 === void 0 ? void 0 : ref1.shift()) === null || ref2 === void 0 ? void 0 : ref2.trim();
}
var $fb373f82e41d32f1$export$2e2bcd8739ae039 = new (0, $5qv2R$parcelplugin.Transformer)({
    async transform ({ asset: asset  }) {
        const assets = [
            asset
        ];
        const filePath = asset.filePath;
        if (filePath.match(/\.vue$/)) {
            // console.log("Transforming " + filePath);
            const code = await asset.getCode();
            if (asset.type === "css") {
                const source = $fb373f82e41d32f1$var$trimSource(code);
                asset.setCode("");
                asset.setMap(null);
                asset.invalidateOnFileChange(filePath);
                // language=JavaScript
                const jsInject = `
                  const style = document.createElement('style');
                  style.innerHTML += \`${source}\`;
                  document.head.appendChild(style);
                `;
                const newJsAsset = {
                    type: "js",
                    content: $fb373f82e41d32f1$var$trimSource(jsInject),
                    uniqueKey: `${asset.id}-js-styles`,
                    bundleBehavior: "inline"
                };
                // @ts-ignore
                assets.push(newJsAsset);
            } else if (asset.type == "vue" || asset.type == "js") {
                const fileSystem = asset.fs;
                const extractedStyles = await $fb373f82e41d32f1$var$extractStyles(fileSystem, filePath);
                // language=JavaScript
                const inject = `setTimeout(() => {
  const style = document.createElement('style');
  style.innerHTML += \`${extractedStyles}\`;
  const thisElement = this.$el;
  const parentElement = thisElement.parentElement
  parentElement.insertBefore(style, thisElement);
}, 0);`;
                const codeEdited = code.replace(/mounted\s*\(\)\s*{\s*([^}]+)\s*}/, (match, p1)=>{
                    return `mounted() { ${p1} ${inject} }`;
                });
                asset.setCode(codeEdited);
                asset.setMap(null);
                asset.invalidateOnFileChange(filePath);
            } else console.log(asset.id, asset.type, code);
        }
        return assets;
    }
});


//# sourceMappingURL=transformer.js.map

// noinspection JSFileReferences
import { readFileSync } from "fs";
import { optimizeJs } from "./optimizeJs";

export function makeJsToInjectCss(css) {
  const vueInjectJs = readFileSync(__dirname + "/vueInjectJs.js");
  // language=JavaScript
  const s = vueInjectJs + `
    setTimeout(() => {
      const rootElement = findRootElement(this.$el);
      const style = rootElement.querySelector("style") ?? document.createElement('style');
      style.innerHTML += \`${css}\`;
      rootElement?.appendChild(style);
    }, 0);
  `;
  return optimizeJs(s);
}

// @ts-ignore
import vueInjectJs from "bundle-text:./vueInjectJs.js";

export function makeJsToInjectCss(css) {
  // language=JavaScript
  return vueInjectJs + `
        setTimeout(() => {
          const style = document.createElement('style');
          style.innerHTML += \`${css}\`;
          const thisElement = this.$el;
          const parentElement = findRootElement(thisElement);
          console.log('thisElement', thisElement);
          if (parentElement) {
            parentElement.appendChild(style);
          }
        }, 0);
`.trim();
}

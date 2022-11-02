// noinspection JSFileReferences,JSUnusedGlobalSymbols

export function makeJsToInjectCss(css) {
  // language=JavaScript
  return `
    setTimeout(() => {
      const rootElement = findRootElement(this.$el);
      const style = rootElement.querySelector("style") ?? document.createElement('style');
      style.innerHTML += \`${css}\`;
      rootElement?.appendChild(style);
    }, 0);
  `;
}

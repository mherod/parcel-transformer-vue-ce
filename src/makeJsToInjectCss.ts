// noinspection JSFileReferences,JSUnusedGlobalSymbols

export function makeJsToInjectCss(css: string): string {
  // language=JavaScript
  return `
    setTimeout(() => {
      const rootElement = findRootElement(thisElement(this));
      const style = rootElement.querySelector("style") ?? document.createElement('style');
      style.innerHTML = \`${css}\` + style.innerHTML;
      rootElement?.appendChild(style);
    }, 0);
  `;
}

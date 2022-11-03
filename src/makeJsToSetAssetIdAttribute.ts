// noinspection ThisExpressionReferencesGlobalObjectJS

export function makeJsToSetAssetIdAttribute(assetId: string): string {
  // language=JavaScript
  return `
    try {
      thisElement(this).setAttribute("data-asset-id", "${assetId}");
    } catch (e) {
    }
  `;
}

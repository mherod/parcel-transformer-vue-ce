// noinspection JSUnusedGlobalSymbols

function findRootElement(me: any): any {
  if (me instanceof ShadowRoot) return me;
  const parentNode = me.parentNode;
  return parentNode ? findRootElement(parentNode) : me;
}

function thisElement(me: any): HTMLElement {
  return me.$el;
}

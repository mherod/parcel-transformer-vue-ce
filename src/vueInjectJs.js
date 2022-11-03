function findRootElement(me) {
  if (me instanceof ShadowRoot) return me;
  const parentNode = me.parentNode;
  return parentNode ? findRootElement(parentNode) : me;
}

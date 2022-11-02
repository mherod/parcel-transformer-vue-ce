function findRootElement(me) {
  if (me instanceof ShadowRoot) {
    return me;
    // return me.host;
  }
  const parentNode = me.parentNode;
  return parentNode ? findRootElement(parentNode) : me;
}

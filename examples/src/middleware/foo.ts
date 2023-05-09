export default () => {
  console.log('[middleware] foo');
  return { path: '/hello-world' };
  // return true;
};

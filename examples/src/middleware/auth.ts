export default () => {
  if (!sessionStorage.getItem('token')) return false;
  return true;
};

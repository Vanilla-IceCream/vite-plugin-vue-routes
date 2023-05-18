export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function hasTs(code: string) {
  const regex = /<script.*?(lang=("|')ts\2).*?>.*?<\/script>/gs;
  return regex.test(code);
}

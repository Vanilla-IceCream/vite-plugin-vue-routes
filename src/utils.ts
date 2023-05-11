export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

export function hasTs(code: string) {
  const regex = /<script.*?(lang=("|')ts\2).*?>.*?<\/script>/gs;
  return regex.test(code);
}

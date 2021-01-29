export function toNumber(value) {
  return isNaN(Number(value)) ? 0 : Number(value);
}

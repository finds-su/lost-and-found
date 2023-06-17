export function convertEmptyStringToNull(input: string) {
  return input.length !== 0 ? input : null
}

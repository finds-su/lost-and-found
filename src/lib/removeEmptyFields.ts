export function removeEmptyFields(obj: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const newObj = Object.assign({}, obj)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  Object.keys(newObj).forEach(function (key) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ;(newObj[key] && typeof newObj[key] === 'object' && removeEmptyFields(newObj[key])) ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ((newObj[key] === '' || newObj[key] === null) && delete newObj[key])
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return newObj
}

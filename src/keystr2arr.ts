const keyStr2Arr = (key: string): string[] => {
  let keyTemp = key
  const needEscape: boolean =
    keyTemp.search(/\\\./) !== -1 || keyTemp.search(/\\\\/) !== -1
  let escReserved1: string
  let escReserved2: string
  let escReservedRegex1: RegExp
  let escReservedRegex2: RegExp
  if (needEscape) {
    escReserved1 = '\uDBFC\uDF2A'
    escReserved2 = '\uDBAC\uDF4A'
    escReservedRegex1 = new RegExp(escReserved1, 'g')
    escReservedRegex2 = new RegExp(escReserved2, 'g')
    keyTemp = keyTemp
      .replace(/\\\\/g, escReserved2)
      .replace(/\\\./g, escReserved1)
  }
  const arr = keyTemp.split('.')
  if (needEscape) {
    arr.forEach((item, i) => {
      arr[i] = item
        .replace(escReservedRegex2, '\\')
        .replace(escReservedRegex1, '.')
    })
  }
  return arr
}

export { keyStr2Arr }

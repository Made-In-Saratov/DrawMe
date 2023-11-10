export const parseInputValue = (value: string) => {
  if (/^\d*\.?\d+$/.test(value)) {
    return +value
  }

  return 0
}

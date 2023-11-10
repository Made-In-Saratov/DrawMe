export const parseInputValue = (value: string): number => {
  if (/^\d*\.?\d+$/.test(value)) {
    return +value
  }

  return 0
}

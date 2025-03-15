export const parseInputValue = (value: string) => {
  if (!value || value.length > 1_000) return 0

  let hasDecimal = false

  for (const char of value) {
    if (char === ".") {
      if (hasDecimal) return 0
      hasDecimal = true
    } else if (char < "0" || char > "9") {
      return 0
    }
  }

  if (value === ".") return 0

  return +value
}

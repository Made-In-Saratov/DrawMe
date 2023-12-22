/**
 * Converts an integer to a byte array using big-endian encoding
 *
 * @param int The integer to convert
 * @param bytes The length of the byte array. Must be 1, 2 or 4
 */
export function intToBytes(int: number, bytes: number) {
  const result = new Uint8Array(bytes)
  switch (bytes) {
    case 1:
      result[0] = int
      break
    case 2:
      result[0] = int >> 8
      result[1] = int & 0xff
      break
    case 4:
      result[0] = int >> 24
      result[1] = (int >> 16) & 0xff
      result[2] = (int >> 8) & 0xff
      result[3] = int & 0xff
      break
    default:
      throw new Error("Invalid length")
  }
  return result
}

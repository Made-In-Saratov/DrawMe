/**
 * Converts a byte array to an integer using big-endian encoding
 *
 * @param bytes The byte array to convert
 * @param length The length of the byte array. Must be 1, 2 or 4
 */
export function bytesToInt(bytes: Uint8Array, length: number) {
  switch (length) {
    case 1:
      return bytes[0]
    case 2:
      return bytes[0] * 256 + bytes[1]
    case 4:
      return (bytes[0] << 24) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3]
    default:
      throw new Error("Invalid length")
  }
}

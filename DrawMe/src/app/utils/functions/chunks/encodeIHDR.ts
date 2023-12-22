import CRC32 from "crc-32"

import { IImage } from "@/store/slices/image/types"
import { intToBytes } from "@/utils/functions"

const encoder = new TextEncoder()
const name = encoder.encode("IHDR")
const length = intToBytes(13, 4)

export default function encodeIHDR(image: IImage, isColored: boolean) {
  length

  const width = intToBytes(image.width, 4)
  const height = intToBytes(image.height, 4)

  const colorType = isColored ? 2 : 0
  const bitDepth = 8
  const compression = 0
  const filter = 0
  const interlace = 0

  const crc = CRC32.buf(
    new Uint8Array([
      ...width,
      ...height,
      bitDepth,
      colorType,
      compression,
      filter,
      interlace,
    ]),
    CRC32.bstr("IHDR")
  )

  return new Uint8Array([
    ...length,
    ...name,
    ...width,
    ...height,
    bitDepth,
    colorType,
    compression,
    filter,
    interlace,
    ...intToBytes(crc, 4),
  ])
}

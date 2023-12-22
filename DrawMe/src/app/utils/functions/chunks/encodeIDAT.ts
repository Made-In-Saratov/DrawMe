import CRC32 from "crc-32"
import { deflate } from "pako"

import { intToBytes } from "@/utils/functions"

const encoder = new TextEncoder()
const name = encoder.encode("IDAT")

export default function encodeIDAT(
  pixels: number[],
  bytesPerPixel: number,
  width: number
) {
  const data = new Uint8ClampedArray(pixels.length + width * bytesPerPixel)
  for (let i = 0; i < pixels.length; i += width * bytesPerPixel) {
    const scanline = pixels.slice(i, i + width * bytesPerPixel)
    const filterType = 0
    data.set([filterType, ...scanline], i + i / (width * bytesPerPixel))
  }

  const defaltedData = deflate(data)
  const crc = CRC32.buf(defaltedData, CRC32.bstr("IDAT"))
  const chunkLength = intToBytes(defaltedData.length, 4)
  const crcBytes = intToBytes(crc, 4)

  return new Uint8Array([...chunkLength, ...name, ...defaltedData, ...crcBytes])
}

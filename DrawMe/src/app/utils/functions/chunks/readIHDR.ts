import CRC32 from "crc-32"

import { bytesToInt } from "@/utils/functions"

type ColorTypeT = 0 | 2 | 3 | 4 | 6
type CompressionT = 0
type FilterT = 0
type InterlaceT = 0 | 1

interface IHDR {
  width: number
  height: number
  bitDepth: number
  colorType: ColorTypeT
  compression: CompressionT
  filter: FilterT
  interlace: InterlaceT
}

export default function readIHDR(byteArray: Uint8Array): IHDR {
  const width = bytesToInt(byteArray.slice(0, 4), 4)
  const height = bytesToInt(byteArray.slice(4, 8), 4)
  const bitDepth = byteArray[8]

  const colorType = byteArray[9]
  if (!isColorTypeT(colorType)) throw new Error("Unknown PNG color type")

  const compression = byteArray[10]
  if (!isCompressionT(compression)) throw new Error("Unknown PNG compression")

  const filter = byteArray[11]
  if (!isFilterT(filter)) throw new Error("Unknown PNG filter")

  const interlace = byteArray[12]
  if (!isInterlaceT(interlace)) throw new Error("Unknown PNG interlace")

  const crc = CRC32.buf(byteArray.slice(0, 13), CRC32.bstr("IHDR"))
  if (crc !== bytesToInt(byteArray.slice(13, 17), 4))
    throw new Error("IHDR chunk CRC mismatch")

  return {
    width,
    height,
    bitDepth,
    colorType,
    compression,
    filter,
    interlace,
  }
}

function isColorTypeT(value: number): value is ColorTypeT {
  return [0, 2, 3, 4, 6].indexOf(value) !== -1
}

function isCompressionT(value: number): value is CompressionT {
  return value === 0
}

function isFilterT(value: number): value is FilterT {
  return value === 0
}

function isInterlaceT(value: number): value is InterlaceT {
  return [0, 1].indexOf(value) !== -1
}

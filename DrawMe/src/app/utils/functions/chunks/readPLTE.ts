import CRC32 from "crc-32"

import { bytesToInt } from "@/utils/functions"

export default function readPLTE(byteArray: Uint8Array) {
  if ((byteArray.length - 4) % 3 !== 0)
    throw new Error("Invalid PLTE chunk length")

  const palette: number[][] = []
  for (let i = 0; i < byteArray.length; i += 3) {
    palette.push([byteArray[i], byteArray[i + 1], byteArray[i + 2]])
  }

  const crc = CRC32.buf(
    byteArray.slice(0, byteArray.length - 4),
    CRC32.bstr("PLTE")
  )
  if (crc !== bytesToInt(byteArray.slice(byteArray.length - 4), 4))
    throw new Error("PLTE chunk CRC mismatch")

  return palette
}

import CRC32 from "crc-32"

import { bytesToInt } from "@/utils/functions"

export default function readIDAT(byteArray: Uint8Array) {
  const crc = CRC32.buf(
    byteArray.slice(0, byteArray.length - 4),
    CRC32.bstr("IDAT")
  )
  if (crc !== bytesToInt(byteArray.slice(byteArray.length - 4), 4))
    throw new Error("IDAT chunk CRC mismatch")

  return byteArray.slice(0, byteArray.length - 4)
}

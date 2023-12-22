import CRC32 from "crc-32"

import { bytesToInt } from "@/utils/functions"

export default function readIHDR(byteArray: Uint8Array) {
  const gamma = bytesToInt(byteArray.slice(0, 4), 4)

  const crc = CRC32.buf(byteArray.slice(0, 4), CRC32.bstr("gAMA"))
  if (crc !== bytesToInt(byteArray.slice(4, 8), 4))
    throw new Error("gAMA chunk CRC mismatch")

  return gamma
}

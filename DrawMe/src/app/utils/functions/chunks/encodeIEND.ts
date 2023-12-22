import CRC32 from "crc-32"

import { intToBytes } from "@/utils/functions/intToBytes"

const encoder = new TextEncoder()
const name = encoder.encode("IEND")

export default function encodeIEND() {
  const crc = CRC32.buf(name, CRC32.bstr("IEND"))
  const chunkLength = intToBytes(0, 4)
  const crcBytes = intToBytes(crc, 4)
  return new Uint8Array([...chunkLength, ...name, ...crcBytes])
}

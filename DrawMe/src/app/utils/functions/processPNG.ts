import { inflate } from "pako"

import { IImage } from "@/store/slices/image/types"
import { bytesToInt } from "@/utils/functions"
import readgAMA from "@/utils/functions/chunks/readgAMA"
import readIDAT from "@/utils/functions/chunks/readIDAT"
import readIHDR from "@/utils/functions/chunks/readIHDR"
import readPLTE from "@/utils/functions/chunks/readPLTE"

const textDecoder = new TextDecoder("utf-8")

export function processPNG(data: ArrayBuffer): [IImage, number] {
  const byteArray = new Uint8Array(data)

  let offset = 0
  let gamma = 0
  let palette: number[][] = []

  const pixelData: Uint8Array[] = []
  const image: IImage = {
    width: 0,
    height: 0,
    pixels: [],
    maxColorValue: 255,
    isP6: true,
  }

  const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10]
  for (; offset < pngSignature.length; offset++) {
    if (byteArray[offset] !== pngSignature[offset])
      throw new Error("Неверная сигнатура файла png")
  }

  while (true) {
    const { chunkLength, chunkType } = readChunkHeader(byteArray, offset)
    switch (chunkType) {
      case "IHDR": {
        const { width, height, bitDepth, colorType, interlace } = readIHDR(
          byteArray.slice(offset + 8, offset + chunkLength + 12)
        ) // 12 = 8 (chunk header) + 4 (crc)

        if (bitDepth !== 8) throw new Error("Неподдерживаемая глубина цвета")
        if ([0, 2, 3].indexOf(colorType) === -1)
          throw new Error(`Неподдерживаемый тип цвета: ${colorType}`)
        if (interlace !== 0) throw new Error("Неподдерживаемый тип интерлейса")

        image.width = width
        image.height = height
        image.isP6 = colorType === 2 || colorType === 3
        break
      }
      case "PLTE":
        if (pixelData.length)
          throw new Error("PLTE чанк не может быть после IDAT чанка")
        if (palette.length)
          throw new Error("Файл не может содержать два PLTE чанка")

        palette = readPLTE(
          byteArray.slice(offset + 8, offset + chunkLength + 12)
        )
        break
      case "IDAT":
        pixelData.push(
          readIDAT(byteArray.slice(offset + 8, offset + chunkLength + 12))
        )
        break
      case "gAMA":
        gamma =
          readgAMA(byteArray.slice(offset + 8, offset + chunkLength + 12)) /
          100000
        break
      case "IEND": {
        if (!image.width || !image.height)
          throw new Error("Неверно указан размер изображения")
        if (!pixelData.length) throw new Error("В файле нет IDAT чанков")

        const pixelDataLength = pixelData.reduce(
          (acc, chunk) => acc + chunk.length,
          0
        )
        const mergedData = new Uint8Array(pixelDataLength)
        let i = 0
        for (const chunk of pixelData) {
          mergedData.set(chunk, i)
          i += chunk.length
        }

        const inflatedData = inflate(mergedData)
        const bytesPerPixel = palette.length !== 0 || !image.isP6 ? 1 : 3
        const pixels = new Array(image.height * image.width * bytesPerPixel)

        for (let y = 0; y < image.height; y++) {
          const scanline = inflatedData.slice(
            y * (image.width * bytesPerPixel + 1) + 1,
            (y + 1) * (image.width * bytesPerPixel + 1)
          )
          const filterType = inflatedData[(image.width * bytesPerPixel + 1) * y]

          const unfilterFunc = NumToUnfilter[filterType]
          unfilterFunc(
            scanline,
            pixels,
            bytesPerPixel,
            y * image.width * bytesPerPixel,
            image.width * bytesPerPixel
          )
        }

        const result = new Array(image.height * image.width * 3)
        for (let i = 0, j = 0; i < pixels.length; i++) {
          if (palette.length !== 0) {
            result[j++] = palette[pixels[i]][0]
            result[j++] = palette[pixels[i]][1]
            result[j++] = palette[pixels[i]][2]
          } else if (image.isP6) result[j++] = pixels[i]
          else {
            result[j++] = pixels[i]
            result[j++] = pixels[i]
            result[j++] = pixels[i]
          }
        }

        image.pixels = result

        return [image, gamma]
      }
      default:
        if (chunkType[0].toUpperCase() === chunkType[0])
          throw new Error(`Неподдерживаемый тип чанка ${chunkType}`)
        else console.warn(`Unsupported chunk type ${chunkType}`)
    }
    offset += chunkLength + 12
  }
}

function readChunkHeader(byteArray: Uint8Array, offset: number) {
  const chunkLength = bytesToInt(byteArray.slice(offset, offset + 4), 4)
  const chunkType = textDecoder.decode(byteArray.slice(offset + 4, offset + 8))
  return { chunkLength, chunkType }
}

const NumToUnfilter: Record<number, typeof unFilterNone> = {
  0: unFilterNone,
  1: unFilterSub,
  2: unFilterUp,
  3: unFilterAverage,
  4: unFilterPaeth,
}

/* eslint-disable no-param-reassign */
function unFilterNone(
  scanline: Uint8Array,
  pixels: number[],
  bpp: number,
  offset: number,
  length: number
) {
  for (let i = 0, to = length; i < to; i++) pixels[offset + i] = scanline[i]
}

function unFilterSub(
  scanline: Uint8Array,
  pixels: number[],
  bpp: number,
  offset: number,
  length: number
) {
  let i = 0
  for (; i < bpp; i++) pixels[offset + i] = scanline[i]
  for (; i < length; i++) {
    // Raw(x) + Raw(x - bpp)
    pixels[offset + i] = (scanline[i] + pixels[offset + i - bpp]) & 0xff
  }
}

function unFilterUp(
  scanline: Uint8Array,
  pixels: number[],
  bpp: number,
  offset: number,
  length: number
) {
  let i = 0,
    byte,
    prev
  // Prior(x) is 0 for all x on the first scanline
  if (offset - length < 0)
    for (; i < length; i++) {
      pixels[offset + i] = scanline[i]
    }
  else
    for (; i < length; i++) {
      // Raw(x)
      byte = scanline[i]
      // Prior(x)
      prev = pixels[offset + i - length]
      pixels[offset + i] = (byte + prev) & 0xff
    }
}

function unFilterAverage(
  scanline: Uint8Array,
  pixels: number[],
  bpp: number,
  offset: number,
  length: number
) {
  let i = 0,
    byte,
    prev,
    prior
  if (offset === 0) {
    // Prior(x) == 0 && Raw(x - bpp) == 0
    for (; i < bpp; i++) {
      pixels[offset + i] = scanline[i]
    }
    // Prior(x) == 0 && Raw(x - bpp) != 0 (right shift, prevent doubles)
    for (; i < length; i++) {
      pixels[offset + i] =
        (scanline[i] + (pixels[offset + i - bpp] >> 1)) & 0xff
    }
  } else {
    // Prior(x) != 0 && Raw(x - bpp) == 0
    for (; i < bpp; i++) {
      pixels[offset + i] =
        (scanline[i] + (pixels[offset - length + i] >> 1)) & 0xff
    }
    // Prior(x) != 0 && Raw(x - bpp) != 0
    for (; i < length; i++) {
      byte = scanline[i]
      prev = pixels[offset + i - bpp]
      prior = pixels[offset + i - length]
      pixels[offset + i] = (byte + ((prev + prior) >> 1)) & 0xff
    }
  }
}

function unFilterPaeth(
  scanline: Uint8Array,
  pixels: number[],
  bpp: number,
  offset: number,
  length: number
) {
  let i = 0,
    raw,
    a,
    b,
    c,
    p,
    pa,
    pb,
    pc,
    pr
  if (offset - length < 0) {
    // Prior(x) == 0 && Raw(x - bpp) == 0
    for (; i < bpp; i++) {
      pixels[offset + i] = scanline[i]
    }
    // Prior(x) == 0 && Raw(x - bpp) != 0
    // paethPredictor(x, 0, 0) is always x
    for (; i < length; i++) {
      pixels[offset + i] = (scanline[i] + pixels[offset + i - bpp]) & 0xff
    }
  } else {
    // Prior(x) != 0 && Raw(x - bpp) == 0
    // paethPredictor(x, 0, 0) is always x
    for (; i < bpp; i++) {
      pixels[offset + i] = (scanline[i] + pixels[offset + i - length]) & 0xff
    }
    // Prior(x) != 0 && Raw(x - bpp) != 0
    for (; i < length; i++) {
      raw = scanline[i]
      a = pixels[offset + i - bpp]
      b = pixels[offset + i - length]
      c = pixels[offset + i - length - bpp]
      p = a + b - c
      pa = Math.abs(p - a)
      pb = Math.abs(p - b)
      pc = Math.abs(p - c)
      if (pa <= pb && pa <= pc) pr = a
      else if (pb <= pc) pr = b
      else pr = c
      pixels[offset + i] = (raw + pr) & 0xff
    }
  }
}

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
        const pixels: number[] = []
        console.log(inflatedData)
        for (let y = 0; y < image.height; y++) {
          const scanline = inflatedData.slice(
            y * (image.width * bytesPerPixel + 1) + 1,
            (y + 1) * (image.width * bytesPerPixel + 1)
          )
          // console.log(scanline)
          const filterType = inflatedData[
            (image.width * bytesPerPixel + 1) * y
          ] as 0 | 1 | 2 | 3 | 4
          console.log(
            inflatedData.slice(
              y * (image.width * bytesPerPixel + 1),
              (y + 1) * (image.width * bytesPerPixel + 1)
            )[0]
          )
          let prevUnfilteredLine = new Uint8Array()
          const unfilter = unfilters[FILTER_TYPES[filterType]]
          const unfilteredLine = unfilter(
            scanline,
            bytesPerPixel,
            prevUnfilteredLine
          )
          pixels.push(...unfilteredLine)
          prevUnfilteredLine = unfilteredLine
        }
        console.log(pixels)
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

        console.log(image, gamma)
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

const FILTER_TYPES = {
  0: "none",
  1: "sub",
  2: "up",
  3: "average",
  4: "paeth",
} as const

const unfilters = {
  none: (data: Uint8Array) => {
    return data
  },
  sub: (data: Uint8Array, bytesPerPixel: number) => {
    const unfiltered = new Uint8Array(data.length)
    for (let i = 0; i < data.length; i++) {
      const left = unfiltered[i - bytesPerPixel] || 0
      unfiltered[i] = (data[i] + left) & 0xff
    }
    return unfiltered
  },
  up: (
    data: Uint8Array,
    bytesPerPixel: number,
    prevUnfilteredLine: Uint8Array
  ) => {
    const unfilteredLine = new Uint8Array(data.length)
    for (let i = 0; i < data.length; i++) {
      const up = prevUnfilteredLine[i] || 0
      unfilteredLine[i] = (up + data[i]) & 0xff
    }
    return unfilteredLine
  },
  average: (
    data: Uint8Array,
    bytesPerPixel: number,
    prevUnfilteredLine: Uint8Array
  ) => {
    const unfilteredLine = new Uint8Array(data.length)
    for (let i = 0; i < data.length; i += bytesPerPixel) {
      for (let j = 0; j < bytesPerPixel; j++) {
        const left = i > 0 ? unfilteredLine[i + j - bytesPerPixel] : 0
        const above = prevUnfilteredLine[i + j] || 0
        const avg = (left + above) >> 1
        unfilteredLine[i + j] = (data[i + j] + avg) & 0xff
      }
    }
    return unfilteredLine
  },
  paeth: (
    data: Uint8Array,
    bytesPerPixel: number,
    prevUnfilteredLine: Uint8Array
  ) => {
    const unfilteredLine = new Uint8Array(data.length)
    for (let i = 0; i < data.length; i += bytesPerPixel) {
      for (let j = 0; j < bytesPerPixel; j++) {
        const left = i > 0 ? unfilteredLine[i + j - bytesPerPixel] : 0
        const above = prevUnfilteredLine[i + j] || 0
        const upperLeft = i > 0 ? prevUnfilteredLine[i + j - bytesPerPixel] : 0
        const p = paeth(left, above, upperLeft)
        unfilteredLine[i + j] = (data[i + j] + p) & 0xff
      }
    }
    return unfilteredLine
  },
}

function paeth(left: number, above: number, upperLeft: number) {
  const p = left + above - upperLeft
  const pa = Math.abs(p - left)
  const pb = Math.abs(p - above)
  const pc = Math.abs(p - upperLeft)
  if (pa <= pb && pa <= pc) {
    return left
  } else if (pb <= pc) {
    return above
  } else {
    return upperLeft
  }
}

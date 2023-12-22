import { IImage } from "@/store/slices/image/types"

export function processPPM(data: ArrayBuffer) {
  const uint8Array = new Uint8Array(data)
  const decoder = new TextDecoder("utf-8")
  const string = decoder.decode(uint8Array)

  if (!string.startsWith("P5") && !string.startsWith("P6"))
    throw new Error(
      "Неверный формат файла. Файл должен быть соотвествовать стандарту PNM P5 или P6"
    )

  const isP6 = string.startsWith("P6")

  if (!RegExp(/\s/).exec(string[2]))
    throw new Error("Неверный формат файла. Неверно определён заголовок")

  let width = NaN,
    height = NaN,
    maxColorValue = NaN

  let prevIndex = 0

  try {
    for (let i = 3; i < string.length; i++) {
      if (RegExp(/\s/).exec(string[i])) {
        width = Number(string.slice(3, i).trim())
        prevIndex = i
        break
      }
    }

    for (let i = prevIndex + 1; i < string.length; i++) {
      if (RegExp(/\s/).exec(string[i])) {
        height = Number(string.slice(prevIndex + 1, i).trim())
        prevIndex = i
        break
      }
    }

    for (let i = prevIndex + 1; i < string.length; i++) {
      if (RegExp(/\s/).exec(string[i])) {
        maxColorValue = Number(string.slice(prevIndex + 1, i).trim())
        prevIndex = i
        break
      }
    }
  } catch {
    throw new Error("Неверный формат файла. Неверно определён заголовок")
  }

  if (isNaN(width) || isNaN(height) || isNaN(maxColorValue))
    throw new Error("Неверный формат файла. Неверно определён заголовок")

  if (maxColorValue > 65535)
    throw new Error(
      "Неверный формат файла. Максимальное значение цвета не может быть больше 65535"
    )

  let pixels = uint8Array.slice(prevIndex + 1)
  const requiredLength =
    width * height * (isP6 ? 3 : 1) * (maxColorValue > 255 ? 2 : 1)

  if (pixels.length !== requiredLength)
    throw new Error(
      `Неправильное количество пикселей. Ожидалось: ${requiredLength}, получено: ${pixels.length}`
    )

  if (pixels.some(pixel => pixel > maxColorValue))
    throw new Error(
      `Неверное значение цвета пикселя. Максимальное значение цвета: ${maxColorValue}`
    )

  if (!isP6) {
    const newPixels = new Uint8Array(width * height * 3)
    for (let i = 0; i < pixels.length; i++) {
      newPixels[i * 3] = pixels[i]
      newPixels[i * 3 + 1] = pixels[i]
      newPixels[i * 3 + 2] = pixels[i]
    }
    pixels = newPixels
  }

  const image: IImage = {
    pixels: Array.from(pixels),
    width,
    height,
    maxColorValue,
    isP6,
  }
  return image
}

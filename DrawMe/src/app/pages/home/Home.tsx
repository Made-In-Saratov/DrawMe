import {
  ChangeEventHandler,
  MouseEventHandler,
  useCallback,
  useRef,
  useState,
} from "react"

import styled from "styled-components"

import Draw from "./Draw"

import Button from "@/components/Button"
import { header48, text14, text16 } from "@/utils/fonts"
import { IImage } from "@/utils/types/image"

export default function Home() {
  const input = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const [image, setImage] = useState<IImage | null>(null)

  const handleButtonClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    () => input.current?.click(),
    [input]
  )

  const handleFileUpload = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      if (!event.target.files?.length) return
      const file = event.target.files[0]
      if (!file.name.endsWith(".ppm") && !file.name.endsWith(".pgm")) {
        setError(
          "Неверный формат файла. Файл должен иметь расширение .ppm или .pgm"
        )
        return
      }

      const reader = new FileReader()

      reader.onloadend = event => {
        try {
          const result = event.target?.result as ArrayBuffer
          const uint8Array = new Uint8Array(result)
          const decoder = new TextDecoder("utf-8")
          const string = decoder.decode(uint8Array)

          if (!string.startsWith("P5") && !string.startsWith("P6"))
            throw new Error("Неверный формат файла. Файл должен быть P5 или P6")

          const isP6 = string.startsWith("P6")

          if (!RegExp(/\s/).exec(string[2]))
            throw new Error(
              "Неверный формат файла. Неверно определён заголовок"
            )

          let width: number = NaN,
            height: number = NaN,
            maxColorValue: number = NaN

          let prevIndex: number = 0

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
            throw new Error(
              "Неверный формат файла. Неверно определён заголовок"
            )
          }

          if (isNaN(width) || isNaN(height) || isNaN(maxColorValue))
            throw new Error(
              "Неверный формат файла. Неверно определён заголовок"
            )

          if (maxColorValue > 65535)
            throw new Error(
              "Неверный формат файла. Максимальное значение цвета не может быть больше 65535"
            )

          const pixels = uint8Array.slice(prevIndex + 1)
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

          setImage({
            pixels,
            width,
            height,
            maxColorValue,
            isP6,
          })
        } catch (error) {
          if (error instanceof Error) setError(error.message)
          reader.abort()
          return
        } finally {
          setIsLoading(false)
        }
      }

      reader.onloadstart = () => {
        setIsLoading(true)
        setError(null)
      }

      reader.readAsArrayBuffer(file)
    },
    []
  )

  const goBack = useCallback(() => setImage(null), [])

  if (image) return <Draw goBack={goBack} image={image} />

  return (
    <Wrapper>
      <h1>Draw Me</h1>
      <p>Лучший редактор изображений для спортивного программирования.</p>
      <UploadButton data-type="primary" onClick={handleButtonClick}>
        {isLoading ? "Загрузка..." : "Загрузить файл"}
        <input
          type="file"
          ref={input}
          accept=".pgm,.ppm"
          onChange={handleFileUpload}
        />
      </UploadButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  position: absolute;
  top: 50%;
  transform: translate(0, -50%);

  > h1 {
    margin: 0 0 20px 0;
    ${header48};
    text-transform: uppercase;
  }

  > p {
    margin: 0 0 32px 0;
    ${text16};
  }
`

const UploadButton = styled(Button)`
  > input {
    display: none;
  }
`

const ErrorMessage = styled.span`
  color: var(--red);
  ${text14};
  max-width: 320px;
  text-align: center;

  position: absolute;
  bottom: -46px;
`

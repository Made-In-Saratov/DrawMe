import { MouseEventHandler, useCallback, useEffect, useRef } from "react"

import styled from "styled-components"

import { IImage } from "./types"

import Button from "@/components/Button"
import Canvas from "@/components/Canvas"

interface IDrawProps {
  goBack: () => void
  image: IImage
}

export default function Draw({ goBack, image }: IDrawProps) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvas.current) return

    const { pixels: rawPixels, width, height, maxColorValue, isP6 } = image
    canvas.current.width = width
    canvas.current.height = height
    const pixels = maxColorValue > 255 ? new Uint16Array(rawPixels) : rawPixels // convert to Uint16Array if maxColorValue > 255
    const norm = 255 / maxColorValue // normalize values to range [0, 255]

    // clamped values are integers in range [0, 255]
    const clampedArray = new Uint8ClampedArray(width * height * 4)

    // color
    if (isP6)
      for (let i = 0; i < width * height; i++) {
        clampedArray[i * 4] = pixels[i * 3] * norm
        clampedArray[i * 4 + 1] = pixels[i * 3 + 1] * norm
        clampedArray[i * 4 + 2] = pixels[i * 3 + 2] * norm
        clampedArray[i * 4 + 3] = 255
      }
    // grayscale
    else
      for (let i = 0; i < width * height; i++) {
        clampedArray[i * 4] = pixels[i] * norm
        clampedArray[i * 4 + 1] = pixels[i] * norm
        clampedArray[i * 4 + 2] = pixels[i] * norm
        clampedArray[i * 4 + 3] = 255
      }

    const imageData = new ImageData(clampedArray, width, height)
    const context = canvas.current.getContext("2d")
    context?.putImageData(imageData, 0, 0)
  }, [image])

  const handleLoadClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    goBack,
    [goBack]
  )

  return (
    <Wrapper>
      <canvas ref={canvas} />
      <ButtonWrapper>
        <Button data-type="secondary" onClick={handleLoadClick}>
          Загрузить другое
        </Button>
        <Button data-type="primary">Скачать изображение</Button>
      </ButtonWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  height: 100vh;
  box-sizing: border-box;
  padding: 20px;
`

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  gap: 24px;
  padding: 20px 24px;

  border-radius: 30px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 4px 8px 20px 0px rgba(16, 0, 65, 0.15);
  backdrop-filter: blur(8px);
`

import { useEffect, useRef } from "react"

import styled from "styled-components"

import { ISpace } from "@/pages/home/Spaces/types"
import { useAppSelector } from "@/store"
import { IImage } from "@/store/slices/image/types"
import { text20 } from "@/utils/fonts"
import { countNumberOfSelectedChannels } from "@/utils/functions"
import { inverseGammaCorrection, gammaCorrection } from "@/utils/functions"

interface ICanvasProps {
  image: IImage | null
  space?: ISpace
  selectedChannels?: boolean[]
}

export default function Canvas({ image }: ICanvasProps) {
  const imageData = useAppSelector(({ image }) => image)

  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvas.current || !image) return

    const processedImage =
      imageData.gamma !== 0
        ? gammaCorrection(inverseGammaCorrection(image, 0), imageData.gamma)
        : image

    const {
      pixels: rawPixels,
      width,
      height,
      maxColorValue,
      isP6,
    } = processedImage
    canvas.current.width = width
    canvas.current.height = height
    // FIXME: conversion doesn't work for 2 byte pixels
    const pixels = maxColorValue > 255 ? new Uint16Array(rawPixels) : rawPixels // convert to Uint16Array if maxColorValue > 255
    const norm = 255 / maxColorValue // normalization coefficient

    // clamped values are integers in range [0, 255]
    const clampedArray = new Uint8ClampedArray(width * height * 4)

    // color
    // if (isP6)
    //   for (let i = 0; i < width * height; i++) {
    //     const converted = space.converter([
    //       pixels[i * 3] * norm,
    //       pixels[i * 3 + 1] * norm,
    //       pixels[i * 3 + 2] * norm,
    //     ])
    //     let rgb = []
    //     if (countNumberOfSelectedChannels(selectedChannels) === 1) {
    //       const idx = selectedChannels?.findIndex(value => value)
    //       rgb = space.reverseConverter([
    //         converted[idx],
    //         converted[idx],
    //         converted[idx],
    //       ])
    //     } else {
    //       rgb = space.reverseConverter([
    //         selectedChannels[0] ? converted[0] : 0,
    //         selectedChannels[1] ? converted[1] : 0,
    //         selectedChannels[2] ? converted[2] : 0,
    //       ])
    //     }
    //     clampedArray[i * 4] = rgb[0]
    //     clampedArray[i * 4 + 1] = rgb[1]
    //     clampedArray[i * 4 + 2] = rgb[2]
    //     clampedArray[i * 4 + 3] = 255
    //   }
    // // grayscale
    // else {
    //   console.log("hey P5")
    //   for (let i = 0; i < width * height; i++) {
    //     const converted = space.converter([
    //       pixels[i] * norm,
    //       pixels[i] * norm,
    //       pixels[i] * norm,
    //     ])
    //     const rgb = space.reverseConverter([
    //       selectedChannels[0] ? converted[0] : 0,
    //       selectedChannels[1] ? converted[1] : 0,
    //       selectedChannels[2] ? converted[2] : 0,
    //     ])
    //     clampedArray[i * 4] = rgb[0]
    //     clampedArray[i * 4 + 1] = rgb[1]
    //     clampedArray[i * 4 + 2] = rgb[2]
    //     clampedArray[i * 4 + 3] = 255
    //   }
    // }

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

    const drawData = new ImageData(clampedArray, width, height)
    const context = canvas.current.getContext("2d")
    context?.putImageData(drawData, 0, 0)
  }, [image, imageData.gamma])

  if (!image)
    return (
      <NoImage>
        <p>Изображение не загружено</p>
      </NoImage>
    )

  return (
    <Wrapper>
      <StyledCanvas ref={canvas} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 4px 8px 20px 0 rgba(16, 0, 65, 0.15);

  width: fit-content;
  height: fit-content;
  padding: 15px;
  box-sizing: border-box;

  margin: 0 auto;
`

const StyledCanvas = styled.canvas`
  border-radius: 6px;
  border: 1px solid var(--white);

  max-width: calc(95vw - 32px);
  max-height: calc(95vh - 32px);
`

const NoImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  > p {
    margin: 0;
    ${text20};
    text-align: center;
  }
`

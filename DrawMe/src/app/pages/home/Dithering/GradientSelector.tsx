import {
  ChangeEventHandler,
  MouseEventHandler,
  useCallback,
  useState,
} from "react"

import styled from "styled-components"

import Button from "@/components/Button"
import Input from "@/components/Input"
import { DitheringAlgorithmT } from "@/pages/home/Dithering/types"
import { useAppDispatch } from "@/store"
import { setPixels } from "@/store/slices/image"
import { text16 } from "@/utils/fonts"
import { generateGradient } from "@/utils/functions"

interface IGradientSelectorProps {
  ditheringAlgorithm: DitheringAlgorithmT
  bitDepth: number
}

export default function GradientSelector({
  ditheringAlgorithm,
  bitDepth,
}: IGradientSelectorProps) {
  const dispatch = useAppDispatch()

  const [width, setWidth] = useState("0")
  const [height, setHeight] = useState("0")

  const handleWidthChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => setWidth(target.value),
    []
  )

  const handleHeightChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => setHeight(target.value),
    []
  )

  const generate = useCallback<MouseEventHandler<HTMLButtonElement>>(
    () =>
      dispatch(
        setPixels({
          pixels: generateGradient(Number(width), Number(height)),
          width: Number(width),
          height: Number(height),
          isP6: false,
        })
      ),
    [dispatch, height, width]
  )

  const isDisabled = Number(width) < 2 || Number(height) < 1

  return (
    <>
      <SizeWrapper>
        <Input
          type="number"
          value={width}
          onChange={handleWidthChange}
          placeholder="↔"
        />
        ×
        <Input
          type="number"
          value={height}
          onChange={handleHeightChange}
          placeholder="↕"
        />
        px
      </SizeWrapper>
      <Button data-type="secondary" onClick={generate} disabled={isDisabled}>
        Создать градиент
      </Button>
    </>
  )
}

const SizeWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;

  ${text16};

  > ${Input} {
    width: 70px;
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`

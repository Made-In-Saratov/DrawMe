import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react"

import { produce } from "immer"
import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import Canvas from "@/components/Canvas"
import EditWrapper from "@/components/EditWrapper"
import Input from "@/components/Input"
import { useAppDispatch, useAppSelector } from "@/store"
import { setImage, setSpace } from "@/store/slices/image"
import { IPoint } from "@/store/slices/image/types"
import { text16, text16Medium } from "@/utils/fonts"
import { gammaCorrection, inverseGammaCorrection } from "@/utils/functions"
import { calculateAntiAliasing } from "@/utils/functions/calculateAntiAliasing"
import { parseInputValue } from "@/utils/functions/validateNumber"
import { spaces } from "@/utils/spaces"

interface IColorSquareProps {
  color: number[]
}

export default function Lines() {
  const dispatch = useAppDispatch()
  const space = useAppSelector(({ image }) => image.space)
  const { src: image } = useAppSelector(({ image }) => image)

  const [channelValues, setChannelValues] = useState<number[]>([0, 0, 0])
  const [width, setWidth] = useState<number>(0)
  const [opacity, setOpacity] = useState<number>(1)
  const [points, setPoints] = useState<IPoint[]>([])
  const [isSelectedFirstPoint, setSelectedFirstPoint] = useState<boolean>(false)

  const handleColorInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const target = event.target
    const copy = channelValues.slice()
    copy[idx] = parseInputValue(target.value)
    setChannelValues(copy)
  }

  const handleWidthInput = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => setWidth(parseInputValue(target.value)),
    []
  )

  const handleOpacityInput = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => setOpacity(parseInputValue(target.value)),
    []
  )

  const getCursorPosition = (
    event: React.MouseEvent<HTMLCanvasElement>,
    canvas: React.RefObject<HTMLCanvasElement>
  ): void => {
    const rect = canvas.current?.getBoundingClientRect()
    if (!rect || !canvas.current || !image) return
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const newPoint = {
      x: x,
      y: y,
    }
    if (isSelectedFirstPoint) {
      setPoints([points[0], newPoint])
      setSelectedFirstPoint(false)
      const newImage = produce(image, draft => {
        if (!draft || !image || !canvas.current) return
        const correctedImage = gammaCorrection(image, 0)
        const newPixels = calculateAntiAliasing(
          correctedImage.pixels,
          canvas.current.width,
          [points[0], newPoint],
          channelValues,
          width,
          opacity
        )
        // eslint-disable-next-line no-param-reassign
        draft.pixels = newPixels
      })
      if (!newImage) return
      const correctedNewImage = inverseGammaCorrection(newImage, 0)
      dispatch(setImage(correctedNewImage))
    } else {
      setPoints([newPoint, points[1]])
      setSelectedFirstPoint(true)
    }
  }

  useEffect(() => {
    dispatch(setSpace("RGB"))
  }, [dispatch])

  return (
    <>
      <Helmet>
        <title>Отрисовка линий</title>
      </Helmet>

      <Canvas onClickHandler={getCursorPosition} />

      <StyledEditWrapper>
        <OptionSelectorWrapper>
          <Title>Цвет</Title>
          <SelectorWrapper>
            <ColorSquare
              color={spaces[space].reverseConverter(channelValues)}
            />
            {"RGB".split("").map((channel: string, idx: number) => {
              return (
                <Selector key={channel}>
                  <span>{channel}:</span>
                  <Input
                    value={channelValues[idx]}
                    onChange={e => handleColorInput(e, idx)}
                    placeholder="0"
                    type="number"
                    min={0}
                    max={255}
                  />
                </Selector>
              )
            })}
          </SelectorWrapper>
        </OptionSelectorWrapper>
        <OptionSelectorWrapper>
          <Title>Толщина</Title>
          <Selector>
            <Input
              value={width}
              onChange={handleWidthInput}
              placeholder="0"
              type="number"
            />
            <span>px</span>
          </Selector>
        </OptionSelectorWrapper>
        <OptionSelectorWrapper>
          <Title>Прозрачность</Title>
          <Selector>
            <Input
              value={opacity}
              onChange={handleOpacityInput}
              placeholder="1"
              type="number"
            />
          </Selector>
        </OptionSelectorWrapper>
      </StyledEditWrapper>
    </>
  )
}

const StyledEditWrapper = styled(EditWrapper)`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
`

const OptionSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
  text-align: center;
  border-right: 2px solid #1000414d;
  ${text16}

  &:last-child {
    border: none;

    ${Input} {
      width: 100px;
    }
  }
`

const SelectorWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Selector = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;

  > span {
    margin: 0 4px;
  }

  > ${Input} {
    width: 60px;
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`

const Title = styled.span`
  ${text16Medium}
`

const ColorSquare = styled.span<IColorSquareProps>`
  width: 24px;
  height: 24px;
  border: 1px solid var(--dark-blue);
  border-radius: 4px;
  margin-right: 8px;
  background: ${props =>
    `rgb(${props.color[0]}, ${props.color[1]}, ${props.color[2]})`};
`

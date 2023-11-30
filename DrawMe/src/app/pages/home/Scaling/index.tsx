import { ChangeEventHandler, useCallback, useState } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import Button from "@/components/Button"
import Dropdown from "@/components/Dropdown"
import EditWrapper from "@/components/EditWrapper"
import Input from "@/components/Input"
import Line from "@/components/Line"
import { ScalingAlgorithmT } from "@/pages/home/Scaling/types"
import { useAppDispatch, useAppSelector } from "@/store"
import { setPixels } from "@/store/slices/image"
import { text16 } from "@/utils/fonts"
import { scaling } from "@/utils/scaling"

export default function Scaling() {
  const dispatch = useAppDispatch()

  const { src: image } = useAppSelector(({ image }) => image)

  const [scalingAlgorithm, setScalingAlgorithm] =
    useState<ScalingAlgorithmT>("NearestNeighbor")

  const [newWidth, setNewWidth] = useState<string>(
    image?.width.toString() ?? "0"
  )
  const [newHeight, setNewHeight] = useState<string>(
    image?.width.toString() ?? "0"
  )

  const [offsetX, setOffsetX] = useState<string>("0")
  const [offsetY, setOffsetY] = useState<string>("0")

  const [b, setB] = useState<string>("0")
  const [c, setC] = useState<string>("0.5")

  const handleItemChange = useCallback((item: string) => {
    for (const [key, value] of Object.entries(scaling))
      if (value.name === item) {
        setScalingAlgorithm(key as ScalingAlgorithmT)
        break
      }
  }, [])

  const handleNewWidthChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(({ target }) => setNewWidth(target.value), [])

  const handleNewHeightChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(({ target }) => setNewHeight(target.value), [])

  const handleOffsetXChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => setOffsetX(target.value),
    []
  )

  const handleOffsetYChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => setOffsetY(target.value),
    []
  )

  const handleBChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => setB(target.value),
    []
  )

  const handleCChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => setC(target.value),
    []
  )

  const handleApply = useCallback(() => {
    if (image) {
      const { pixels, width, height } = image
      const newPixels = scaling[scalingAlgorithm].apply({
        pixels,
        width,
        height,
        newWidth: Number(newWidth),
        newHeight: Number(newHeight),
      })
      dispatch(
        setPixels({
          pixels: newPixels,
          width: Number(newWidth),
          height: Number(newHeight),
        })
      )
    }
  }, [dispatch, image, newHeight, newWidth, scalingAlgorithm])

  return (
    <>
      <Helmet>
        <title>Масштаб</title>
      </Helmet>

      <StyledEditWrapper>
        <StyledDropdown
          items={Object.values(scaling).map(({ name }) => name)}
          activeItem={scaling[scalingAlgorithm].name}
          setActiveItem={handleItemChange}
        />

        <Line />

        <InputBlock>
          <span>Размеры</span>
          <div>
            <Input
              type="number"
              value={newWidth}
              onChange={handleNewWidthChange}
              placeholder="↔"
            />
            ×
            <Input
              type="number"
              value={newHeight}
              onChange={handleNewHeightChange}
              placeholder="↕"
            />
            px
          </div>
        </InputBlock>

        <Line />

        <InputBlock>
          <span>Смещение от центра</span>
          <div>
            <Input
              type="number"
              value={offsetX}
              onChange={handleOffsetXChange}
              placeholder="→"
            />
            ,
            <Input
              type="number"
              value={offsetY}
              onChange={handleOffsetYChange}
              placeholder="↓"
            />
          </div>
        </InputBlock>

        {scalingAlgorithm === "BCSpline" && (
          <>
            <Line />

            <BCInputBlock>
              <span>BC параметры</span>
              <div>
                B:
                <Input
                  type="number"
                  value={b}
                  onChange={handleBChange}
                  placeholder="B"
                />
                C:
                <Input
                  type="number"
                  value={c}
                  onChange={handleCChange}
                  placeholder="C"
                />
              </div>
            </BCInputBlock>
          </>
        )}

        <Button data-type="primary" onClick={handleApply}>
          Применить
        </Button>
      </StyledEditWrapper>
    </>
  )
}

const StyledEditWrapper = styled(EditWrapper)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;

  > hr {
    height: 67px;
  }
`

const StyledDropdown = styled(Dropdown)`
  width: 200px;
`

const InputBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  ${text16};

  > span {
    width: max-content;
  }

  > div {
    display: flex;
    gap: 4px;
    align-items: center;

    > ${Input} {
      width: 70px;
      appearance: textfield;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }
`

const BCInputBlock = styled(InputBlock)`
  > div {
    gap: 6px;

    > ${Input} {
      width: 50px;
    }
  }
`

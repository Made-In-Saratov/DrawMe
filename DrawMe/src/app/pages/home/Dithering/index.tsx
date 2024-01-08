import { MouseEventHandler, useCallback, useState } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import BitDepthSelector from "./BitDepthSelector"
import GradientSelector from "./GradientSelector"

import Button from "@/components/Button"
import Dropdown from "@/components/Dropdown"
import EditWrapper from "@/components/EditWrapper"
import Line from "@/components/Line"
import { DitheringAlgorithmT } from "@/pages/home/Dithering/types"
import { useAppDispatch, useAppSelector } from "@/store"
import { setPixels } from "@/store/slices/image"
import { dithering } from "@/utils/dithering"

export default function Dithering() {
  const dispatch = useAppDispatch()

  const image = useAppSelector(({ image }) => image.src)

  const [ditheringAlgorithm, setDitheringAlgorithm] =
    useState<DitheringAlgorithmT>("None")
  const [bitDepth, setBitDepth] = useState(8)

  const handleItemChange = useCallback((item: string) => {
    for (const [key, value] of Object.entries(dithering))
      if (value.name === item) {
        setDitheringAlgorithm(key as DitheringAlgorithmT)
        break
      }
  }, [])

  const handleSliderChange = useCallback(
    (value: number) => setBitDepth(value),
    []
  )

  const handleApply = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    if (image) {
      const { pixels, width, height } = image
      const newPixels = dithering[ditheringAlgorithm].apply(
        pixels,
        width,
        height,
        bitDepth
      )
      dispatch(setPixels({ pixels: newPixels, width, height }))
    }
  }, [bitDepth, dispatch, ditheringAlgorithm, image])

  const isDisabled = image === null

  return (
    <>
      <Helmet>
        <title>Дизеринг</title>
      </Helmet>

      <StyledEditWrapper>
        <StyledDropdown
          items={Object.values(dithering).map(({ name }) => name)}
          activeItem={dithering[ditheringAlgorithm].name}
          setActiveItem={handleItemChange}
        />
        <BitDepthSelector value={bitDepth} onChange={handleSliderChange} />
        <Button data-type="primary" onClick={handleApply} disabled={isDisabled}>
          Применить
        </Button>

        <Line />

        <GradientSelector
          ditheringAlgorithm={ditheringAlgorithm}
          bitDepth={bitDepth}
        />
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
    height: 40px;
  }
`

const StyledDropdown = styled(Dropdown)`
  width: 180px;
`

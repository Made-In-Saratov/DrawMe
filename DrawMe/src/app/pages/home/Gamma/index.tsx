import { useCallback } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import GammaEditor from "./GammaEditor"

import Canvas from "@/components/Canvas"
import EditWrapper from "@/components/EditWrapper"
import { useAppDispatch, useAppSelector } from "@/store"
import { setImage } from "@/store/slices/image"
import { gammaCorrection, inverseGammaCorrection } from "@/utils/functions"

export default function Gamma() {
  const dispatch = useAppDispatch()

  const image = useAppSelector(({ image }) => image)

  const onConvertClick = useCallback(
    (gamma: number) => {
      const newImage = inverseGammaCorrection(gammaCorrection(image, gamma), 0)

      dispatch(setImage(newImage))
    },
    [dispatch, image]
  )

  const onAdjustClick = useCallback(
    (gamma: number) => {
      // correction to sRGB, then inverse gamma correction with `gamma` parameter
      const newImage = inverseGammaCorrection(gammaCorrection(image, 0), gamma)

      dispatch(setImage(newImage))
    },
    [dispatch, image]
  )

  return (
    <>
      <Helmet>
        <title>Изменение гаммы</title>
      </Helmet>

      <Canvas image={image} />

      <StyledEditWrapper>
        <GammaEditor
          title="Преобразовать:"
          tooltip={
            <span>
              После преобразования гаммы изображение на экране не изменится.
              <br /> Если вы его скачаете, то увидите изменения.
            </span>
          }
          onClick={onConvertClick}
        />
        <GammaEditor
          title="Назначить:"
          tooltip={
            <span>
              После назначения гаммы изображение на экране изменится.
              <br /> Но если вы его скачаете, то не увидите изменения.
            </span>
          }
          onClick={onAdjustClick}
        />
      </StyledEditWrapper>
    </>
  )
}

const StyledEditWrapper = styled(EditWrapper)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
`

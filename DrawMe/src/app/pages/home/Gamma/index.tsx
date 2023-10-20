import { useCallback } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import GammaEditor from "./GammaEditor"

import Canvas from "@/components/Canvas"
import EditWrapper from "@/components/EditWrapper"
import { useAppDispatch, useAppSelector } from "@/store"
import { setGamma, setImage } from "@/store/slices/image"
import { gammaCorrection, inverseGammaCorrection } from "@/utils/functions"

export default function Gamma() {
  const dispatch = useAppDispatch()

  const { src: image, gamma: currentGamma } = useAppSelector(
    ({ image }) => image
  )

  const onConvertClick = useCallback(
    (gamma: number) => {
      if (image) {
        const initialImage = gammaCorrection(
          inverseGammaCorrection(image, 0),
          currentGamma
        ) // get initial image, if it was already converted

        if (gamma === 0) {
          dispatch(setImage(initialImage))
          dispatch(setGamma(0))
        } else {
          const newImage = gammaCorrection(
            gammaCorrection(initialImage, gamma),
            0
          )

          dispatch(setImage(newImage))
          dispatch(setGamma(1 / gamma))
        }
      }
    },
    [currentGamma, dispatch, image]
  )

  const onAdjustClick = useCallback(
    (gamma: number) => {
      // correction to sRGB, then inverse gamma correction with `gamma` parameter
      dispatch(setGamma(gamma))
    },
    [dispatch]
  )

  return (
    <>
      <Helmet>
        <title>Изменение гаммы</title>
      </Helmet>

      <Canvas />

      <StyledEditWrapper>
        <GammaEditor
          title="Преобразовать:"
          tooltip={
            <span>
              После преобразования гаммы изображение на экране не изменится.
              Если вы его скачаете, то увидите изменения.
            </span>
          }
          onClick={onConvertClick}
        />
        <GammaEditor
          title="Назначить:"
          tooltip={
            <span>
              После назначения гаммы изображение на экране изменится. Но если вы
              его скачаете, то не увидите изменения.
            </span>
          }
          autoupdate={true}
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

import { useCallback, useEffect } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import GammaEditor from "./GammaEditor"

import EditWrapper from "@/components/EditWrapper"
import { useAppDispatch, useAppSelector } from "@/store"
import { setGamma, setImage } from "@/store/slices/image"
import { gammaCorrection, inverseGammaCorrection } from "@/utils/functions"

export default function Gamma() {
  const dispatch = useAppDispatch()

  const { src: image, convertedGamma } = useAppSelector(({ image }) => image)

  const onConvertClick = useCallback(
    (gamma: number) => {
      if (image) {
        const initialImage = inverseGammaCorrection(
          gammaCorrection(image, 0),
          convertedGamma
        ) // get initial image, if it was already converted

        if (gamma === 0) {
          dispatch(setImage(initialImage)) // also sets gamma to 0
        } else {
          const newImage = gammaCorrection(
            inverseGammaCorrection(initialImage, gamma),
            0
          )

          dispatch(setImage(newImage))
          dispatch(
            setGamma({
              gamma,
              convertedGamma: gamma,
            })
          )
        }
      }
    },
    [convertedGamma, dispatch, image]
  )

  const onAdjustClick = useCallback(
    (gamma: number) => dispatch(setGamma({ gamma, convertedGamma })),
    [convertedGamma, dispatch]
  )

  return (
    <>
      <Helmet>
        <title>Изменение гаммы</title>
      </Helmet>

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

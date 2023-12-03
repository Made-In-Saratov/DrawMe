import { useCallback } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import EditWrapper from "@/components/EditWrapper"
import Input from "@/components/Input"
import Tooltip from "@/components/Tooltip"
import { useAppDispatch, useAppSelector } from "@/store"
import { setGamma, setImage } from "@/store/slices/image"

export default function Histogram() {
  const dispatch = useAppDispatch()

  const { src: image, convertedGamma } = useAppSelector(({ image }) => image)

  return (
    <>
      <Helmet>
        <title>Гистограмма</title>
      </Helmet>

      <StyledEditWrapper>
        <Tooltip>
          <span>
            Вы можете игнорировать некоторое количество самых тёмных точек
            (слева) и самых ярких точек (справа). Значения должны находиться в
            диапазоне от 0 до 0.5.
          </span>
        </Tooltip>
        <CorrectionControlPanel>
          <CorrectionControl>
            <span>Слева</span>
            <Input placeholder="Гамма..." type="number" />
          </CorrectionControl>
          <CorrectionControl>
            <span>Слева</span>
            <Input placeholder="Гамма..." type="number" />
          </CorrectionControl>
        </CorrectionControlPanel>
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

const CorrectionControlPanel = styled.div`
  display: flex;
`

const CorrectionControl = styled.div``

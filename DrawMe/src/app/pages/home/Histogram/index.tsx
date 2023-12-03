import { useCallback } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import EditWrapper from "@/components/EditWrapper"
import Input from "@/components/Input"
import Tooltip from "@/components/Tooltip"
import { useAppDispatch, useAppSelector } from "@/store"
import { setGamma, setImage } from "@/store/slices/image"
import { text16 } from "@/utils/fonts"
import Button from "@/components/Button"

export default function Histogram() {
  const dispatch = useAppDispatch()

  const { src: image, convertedGamma } = useAppSelector(({ image }) => image)

  return (
    <>
      <Helmet>
        <title>Гистограмма</title>
      </Helmet>

      <StyledEditWrapper>
        <Column>
          <Row>
            <Tooltip>
              <span>
                Вы можете игнорировать некоторое количество самых тёмных точек
                (слева) и самых ярких точек (справа). Значения должны находиться
                в диапазоне от 0 до 0.5.
              </span>
            </Tooltip>
            <span>Доля игнорируемых пикселей</span>
          </Row>
          <Row>
            <CorrectionControlPanel>
              <CorrectionControl>
                <span>Слева:</span>
                <Input placeholder="0" type="number" width={50} />
              </CorrectionControl>
              <CorrectionControl>
                <span>Справа:</span>
                <Input placeholder="0" type="number" width={50} />
              </CorrectionControl>
            </CorrectionControlPanel>
          </Row>
        </Column>
        <Column>
          <Button data-type="primary" disabled={false}>
            Скорректировать
          </Button>
        </Column>
      </StyledEditWrapper>
    </>
  )
}

const StyledEditWrapper = styled(EditWrapper)`
  display: flex;
  gap: 16px;
  padding: 20px 24px;

  ${text16}
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const CorrectionControlPanel = styled.div`
  display: flex;
  gap: 12px;
`

const CorrectionControl = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  > ${Input} {
    width: 70px;
  }
`

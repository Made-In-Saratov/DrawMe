import { useCallback, useState } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import Button from "@/components/Button"
import Dropdown from "@/components/Dropdown"
import EditWrapper from "@/components/EditWrapper"
import Input from "@/components/Input"
import Line from "@/components/Line"
import { ScalingAlgorithmT } from "@/pages/home/Scaling/types"
import { text16 } from "@/utils/fonts"
import { scaling } from "@/utils/scaling"

export default function Scaling() {
  const [scalingAlgorithm, setScalingAlgorithm] =
    useState<ScalingAlgorithmT>("NearestNeighbor")

  const handleItemChange = useCallback((item: string) => {
    for (const [key, value] of Object.entries(scaling))
      if (value.name === item) {
        setScalingAlgorithm(key as ScalingAlgorithmT)
        break
      }
  }, [])

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

        <BCInputBlock>
          <span>Размеры</span>
          <div>
            <Input
              type="number"
              value={0}
              onChange={() => {}}
              placeholder="↔"
            />
            ×
            <Input
              type="number"
              value={0}
              onChange={() => {}}
              placeholder="↕"
            />
            px
          </div>
        </BCInputBlock>

        <Line />

        <InputBlock>
          <span>Смещение от центра</span>
          <div>
            <Input
              type="number"
              value={0}
              onChange={() => {}}
              placeholder="→"
            />
            ,
            <Input
              type="number"
              value={0}
              onChange={() => {}}
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
                  value={0}
                  onChange={() => {}}
                  placeholder="B"
                />
                C:
                <Input
                  type="number"
                  value={0}
                  onChange={() => {}}
                  placeholder="C"
                />
              </div>
            </BCInputBlock>
          </>
        )}

        <Button data-type="primary" onClick={() => {}}>
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

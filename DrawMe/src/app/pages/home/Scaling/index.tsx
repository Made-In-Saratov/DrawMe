import { useCallback, useEffect, useState } from "react"

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

  useEffect(() => {
    const onResize = (event: UIEvent) => {
      event.preventDefault()
      console.log(event)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

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
        <title>Масштабирование</title>
      </Helmet>

      <StyledEditWrapper>
        <StyledDropdown
          items={Object.values(scaling).map(({ name }) => name)}
          activeItem={scaling[scalingAlgorithm].name}
          setActiveItem={handleItemChange}
        />

        <Line />

        <InputBlock>
          <span>Ширина</span>
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
        </InputBlock>

        <Line />

        <InputBlock>
          <span>Смещение от центра</span>
          <div>
            <Input
              type="number"
              value={""}
              onChange={() => {}}
              placeholder="→"
            />
            ,
            <Input
              type="number"
              value={""}
              onChange={() => {}}
              placeholder="↓"
            />
            px
          </div>
        </InputBlock>

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

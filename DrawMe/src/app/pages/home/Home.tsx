import { useCallback } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import { TabT } from "./types"

import Button from "@/components/Button"
import { header48, text14, text16 } from "@/utils/fonts"
import useImageUpload from "@/utils/hooks/useImageUpload"

interface IHomeProps {
  setTab: (tab: TabT) => void
}

export default function Home({ setTab }: IHomeProps) {
  const uploadCallback = useCallback(() => setTab("image"), [setTab])

  const { inputProps, handleClick, isLoading, error } =
    useImageUpload(uploadCallback)

  const navigateToImage = useCallback(() => setTab("image"), [setTab])

  return (
    <>
      <Helmet>
        <title>Draw Me</title>
      </Helmet>

      <MainWrapper>
        <h1>Draw Me</h1>
        <p>
          Изменяйте гамму, цветовые пространства, размеры и многое другое. Все
          вычисления происходят на вашем компьютере, поэтому доступ к
          фотографиям не получит никто, кроме вас.
        </p>
        <Button data-type="primary" onClick={handleClick}>
          {isLoading ? "Загрузка..." : "Загрузить файл"}
          <input {...inputProps} />
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </MainWrapper>

      <BottomWrapper>
        <NavigationText>
          Или вы можете{" "}
          <span onClick={navigateToImage}>перейти в редактор</span> и загрузить
          файл там.
        </NavigationText>
      </BottomWrapper>
    </>
  )
}

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  position: absolute;
  top: 50%;
  transform: translate(0, -50%);

  > h1 {
    margin: 0 0 20px 0;
    ${header48};
    text-transform: uppercase;
  }

  > p {
    margin: 0 0 32px 0;
    max-width: 680px;
    text-align: center;
    ${text16};
  }
`

const ErrorMessage = styled.span`
  color: var(--red);
  ${text14};
  max-width: 320px;
  text-align: center;

  position: absolute;
  bottom: -46px;
`

const BottomWrapper = styled.div`
  width: 100%;
  position: absolute;
  bottom: 20px;
  display: flex;
  justify-content: center;
`

const NavigationText = styled.p`
  margin: 0;
  ${text16};
  text-align: center;

  > span {
    color: var(--light-blue);
    cursor: pointer;
    text-decoration: underline;
  }
`

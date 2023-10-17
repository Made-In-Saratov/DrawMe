import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import GammaEditor from "./GammaEditor"

import Canvas from "@/components/Canvas"
import EditWrapper from "@/components/EditWrapper"
import { IImage } from "@/utils/types/image"

interface IGammaProps {
  image: IImage | null
  setImage: (image: IImage) => void
}

export default function Gamma({ image, setImage }: IGammaProps) {
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
        />
        <GammaEditor
          title="Назначить:"
          tooltip={
            <span>
              После назначения гаммы изображение на экране изменится.
              <br /> Но если вы его скачаете, то не увидите изменения.
            </span>
          }
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

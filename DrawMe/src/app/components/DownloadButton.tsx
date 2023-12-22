import styled from "styled-components"

import { useAppSelector } from "@/store"
import { text16Medium } from "@/utils/fonts"
import usePpmSave from "@/utils/hooks/useImageSave"

interface IDownloadButtonProps {
  className?: string
}

export default function DownloadButton({
  className = "",
}: IDownloadButtonProps) {
  const image = useAppSelector(({ image }) => image.src)

  const isDownloadDisabled = !image

  const handlePpmSave = usePpmSave()

  return (
    <Wrapper className={className} data-disabled={isDownloadDisabled}>
      <ButtonLeft onClick={handlePpmSave}>Скачать .ppm</ButtonLeft>
      <ButtonRight>.png</ButtonRight>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  width: max-content;

  &[data-disabled="true"] {
    > button {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &[data-disabled="false"] {
    > button:hover {
      transform: scale(1.1);
    }
  }
`

const Button = styled.button`
  cursor: pointer;
  border: none;

  padding: 11px 10px 12px 10px;
  height: 40px;
  ${text16Medium};
  color: #ffffff;

  transition: transform 0.25s cubic-bezier(0, 0.61, 0, 1);
`

const ButtonLeft = styled(Button)`
  border-right: 1px solid #ffffff;
  border-radius: 20px 0 0 20px;
  background: linear-gradient(250deg, #b22ff3 0%, var(--light-blue) 100%);

  padding-left: 16px;
`

const ButtonRight = styled(Button)`
  border-left: 1px solid #ffffff;
  border-radius: 0 20px 20px 0;
  background: linear-gradient(250deg, var(--magenta) 0%, #b22ff3 100%);

  padding-right: 16px;
`

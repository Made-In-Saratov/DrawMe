import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import Button from "@/components/Button"
import DownloadButton from "@/components/DownloadButton"
import EditWrapper from "@/components/EditWrapper"
import useImageUpload from "@/utils/hooks/useImageUpload"

export default function Image() {
  const { inputProps, handleClick, isLoading, error } = useImageUpload()

  return (
    <>
      <Helmet>
        <title>Редактирование изображения</title>
      </Helmet>

      <StyledEditWrapper>
        <Button data-type="secondary" onClick={handleClick}>
          {isLoading ? "Загрузка..." : error ? "Ошибка" : "Загрузить другое"}
          <input {...inputProps} />
        </Button>
        <DownloadButton />
      </StyledEditWrapper>
    </>
  )
}

const StyledEditWrapper = styled(EditWrapper)`
  display: flex;
  gap: 24px;
  padding: 20px 24px;
`

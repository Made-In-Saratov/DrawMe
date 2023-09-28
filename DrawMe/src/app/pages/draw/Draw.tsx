import styled from "styled-components";
import Button from "@/components/Button";
import CanvasWithImage from "@/components/Canvas";
import img from '../../../225H_RGB.ppm';

export default function Draw() {
  return (
    <Wrapper>
      <CanvasWithImage image={img}></CanvasWithImage>
      <ButtonWrapper>
        <Button data-type="secondary">
          <input
            type="file"

          />
        </Button>
        {/*<a href={}></a>*/}
        <Button data-type="primary">Скачать изображение</Button>
      </ButtonWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  position: relative;
  top: 16px;
  width: 75%;
  height: 90vh;
  margin: 0 auto;
  border-radius: 8px;
  background: #fff;
`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 24px;
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 30px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 80);
  box-shadow: 4px 8px 20px 0;
`

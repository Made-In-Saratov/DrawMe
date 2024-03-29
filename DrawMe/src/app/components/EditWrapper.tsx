import styled from "styled-components"

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);

  border-radius: 30px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 4px 8px 20px 0 rgba(16, 0, 65, 0.15);
  backdrop-filter: blur(16px);
`

export default ButtonWrapper

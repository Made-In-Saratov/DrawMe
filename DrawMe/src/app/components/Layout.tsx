import styled from "styled-components"

interface ILayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: ILayoutProps) {
  return <PageWrapper>{children}</PageWrapper>
}

const PageWrapper = styled.div`
  box-sizing: border-box;
  min-height: 100vh;
  height: max-content;
`

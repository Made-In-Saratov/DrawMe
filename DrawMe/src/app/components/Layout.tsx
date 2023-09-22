import styled from "styled-components"

interface ILayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: ILayoutProps) {
  return <PageWrapper>{children}</PageWrapper>
}

const PageWrapper = styled.div`
  box-sizing: border-box;
  min-height: calc(100vh - 70px);
  height: max-content;
`

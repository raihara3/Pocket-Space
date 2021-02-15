import React from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import colors from '../colors'

const Header = () => {
  return (
    <HeacerContainer>
      <ImageBox>
        <Image src='/symbol.png' width='45' height='45' />
      </ImageBox>
      <PageTitle>Pocket Space</PageTitle>
    </HeacerContainer>
  )
}

const HeacerContainer = styled.header`
  display: flex;
  height: 60px;
  margin: 0 0 20px 0;
  padding: 0 15px;
  background-color: ${colors.black};
`

const ImageBox = styled.div`
  align-self: center;
  width: 45px;
  height: 45px;
`

const PageTitle = styled.div`
  align-self: center;
  flex-grow: 1;
  padding: 0 45px 0 0;
  font-size: 24px;
  text-align: center;
`

export default Header

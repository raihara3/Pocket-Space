import React, { memo } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import colors from '../colors'

const Footer = () => {
  return (
    <FooterContainer>
      <ImageBox>
        <Image src="/raihara3.png" width="30" height="30" alt="" />
      </ImageBox>
      <CopyRight>&copy;2021 raihara3</CopyRight>
    </FooterContainer>
  )
}

const FooterContainer = styled.footer`
  margin: 30px 0 0;
  padding: 20px 0;
  text-align: center;
`

const ImageBox = styled.div`
  height: 30px;
`

const CopyRight = styled.small`
  color: ${colors.gray01};
`

export default memo(Footer)

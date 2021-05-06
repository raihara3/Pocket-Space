import React, { memo } from 'react'
import styled from 'styled-components'
import colors from '../colors'

interface Props {
  title: string
  description?: string
  children?: React.ReactNode
}

const Card: React.FC<Props> = ({ title, description, children }) => {
  return (
    <Box>
      <Title>{title}</Title>
      <Contents>{description}</Contents>
      {children}
    </Box>
  )
}

const Box = styled.div`
  margin: 10px 0 0;
  padding: 10px 15px;
  background-color: ${colors.white01};
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  box-shadow: 0px 0px 22px -11px rgba(0, 0, 0, 0.3);
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: normal;
`

const Contents = styled.div`
  margin: 10px 0;
`

export default memo(Card)

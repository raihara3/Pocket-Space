import React, { memo } from 'react'

interface Props {
  id?: string
  autoPlay?: boolean
  hidden?: boolean
}

const Video: React.FC<Props> = ({ id, autoPlay = true, hidden = false }) => {
  return <video id={id} autoPlay={autoPlay} hidden={hidden} />
}

export default memo(Video)

import React, { memo } from 'react'
import Head from 'next/head'

const PageHead = () => {
  return (
    <Head>
      <title>WebAR communication</title>
    </Head>
  )
}

export default memo(PageHead)

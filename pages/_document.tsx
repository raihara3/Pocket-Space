import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <title>AR Meet</title>
          <link rel='icon' href='/favicon.ico' type='image/x-icon' />
          <meta name='description' content='This service allows you to play with AR while making calls.' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

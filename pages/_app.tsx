import React from 'react'
import '../styles/global.css'
import { ThemeProvider } from '@material-ui/core'
import theme from '../styles/theme'
import { Provider as NextAuthProvider } from 'next-auth/client'

const App = ({ Component, pageProps }) => {
  return (
    <NextAuthProvider session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </NextAuthProvider>
  )
}

export default App

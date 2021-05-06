import React from 'react'
import { ErrorAlert } from '../components/atoms/Alert'

const Error = ({ statusCode }) => {
  const label = statusCode
    ? `An error ${statusCode} occurred on server`
    : 'An error occurred on client'
  return <ErrorAlert label={label} />
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error

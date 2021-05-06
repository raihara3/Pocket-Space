import React from 'react'
import InputField from '../InputField'

export const normal = () => {
  return <InputField placeholder="Input field" />
}

export const readOnly = () => {
  return <InputField placeholder="Input field" readonly={true} />
}

export const disabled = () => {
  return <InputField placeholder="disabled" disabled={true} />
}

export const hasError = () => {
  return (
    <InputField
      placeholder="Input field"
      hasError={true}
      errorMessage="Error!!"
    />
  )
}

export default {
  title: 'InputField',
}

import React, { memo } from 'react'
import styled from 'styled-components'
import colors from '../colors'

interface Props {
  id?: string
  name?: string
  label?: string
  inputRef?: React.RefObject<HTMLInputElement>
  type?: 'text' | 'number' | 'password'
  readonly?: boolean
  disabled?: boolean
  placeholder?: string
  defaultValue?: string
  hasError?: boolean
  errorMessage?: string
  onChange?: (e: any) => void
}

const InputField: React.FC<Props> = ({
  id,
  name,
  label,
  inputRef,
  type = 'text',
  readonly = false,
  disabled = false,
  placeholder,
  defaultValue,
  hasError = false,
  errorMessage,
  onChange
}) => {
  return (
    <InputBox>
      <label htmlFor={id}>
        {label}
        <Input
          id={id}
          name={name}
          ref={inputRef}
          type={type}
          readOnly={readonly}
          disabled={disabled}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={(e) => {
            onChange && onChange(e)
          }}
        />
        {hasError && (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        )}
      </label>
    </InputBox>
  )
}

const InputBox = styled.div`
  margin: 0 0 10px;
`

const Input = styled.input<{readOnly: boolean}>`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  resize: none;
  width: 100%;
  height: 2rem;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: ${colors.black01};
  border-bottom: 1px solid ${colors.white02};

  ${({readOnly}) => readOnly && `
    color: rgba(255,255,255,0.3);
    font-size: 10px;
    border: none;
  `}
`

const ErrorMessage = styled.span`
  display: block;
  margin: 5px 0 0;
  color: ${colors.red01};
  font-size: 10px;
`

export default memo(InputField)

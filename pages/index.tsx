import React, { useState, useRef } from 'react'
import { Button } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { FileCopy } from '@material-ui/icons'
import styled from 'styled-components'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Card from '../components/molecules/Card'
import InputField from '../components/atoms/InputField'

const Index = () => {
  const [roomURL, setRoomURL] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)
  const [isClickedCreateButton, setIsClickedCreateButton] = useState<boolean>(false)
  const roomURLBox = useRef<HTMLInputElement>(null)

  const createRoom = async() => {
    setIsClickedCreateButton(true)
    const res: any = await fetch('../api/createRoom')
    const json = await res.json()
    if(!res.ok) {
      console.error(new Error(json.message))
      setHasError(true)
      return
    }
    setRoomURL(`${window.location.href}remote/call?room=${json.data.roomID}`)
  }

  const copyRoomID = () => {
    roomURLBox.current?.focus()
    roomURLBox.current?.select()
    document.execCommand('copy')
  }

  return (
    <>
      <Header />
      <Wrap>
        {hasError && (
          <ErrorBox>
            <Alert variant="filled" severity="error">
              Server error. Please try again after a while.
            </Alert>
          </ErrorBox>
        )}
        <span>
          This is a service that allows multiple people to play with WebAR while talking on the phone.
        </span>
        <Card
          title='Step1. Create a Room'
          description='No account is required, just create a Room. It will expire in 3 days.'
        >
          <Button
            variant='contained'
            color='primary'
            disabled={isClickedCreateButton}
            onClick={() => createRoom()}
          >
            CREATE ROOM
          </Button>
        </Card>
        <Card
          title='Step2. Share'
          description='Copy the room URL and share it with your friends!'
        >
          <InputField
            id='roomID'
            inputRef={roomURLBox}
            defaultValue={roomURL}
            readonly={true}
          />
          <Button
            variant='contained'
            color='primary'
            startIcon={<FileCopy />}
            disabled={!roomURL || hasError}
            onClick={() => copyRoomID()}
          >
            COPY URL
          </Button>
        </Card>
        <Card
          title="Step3. Let's play!"
          description="Let's access and play with the issued Room."
        >
          <Button
            variant='contained'
            color='primary'
            href={roomURL}
            disabled={!roomURL || hasError}
          >
            Go to Room
          </Button>
        </Card>
      </Wrap>
      <Footer />
    </>
  )
}

const Wrap = styled.div`
  width: 90%;
  margin: auto;
`

const ErrorBox = styled.div`
  margin: 0 0 10px;
`

export default Index

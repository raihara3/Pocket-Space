import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import styled from 'styled-components'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Card from '../components/molecules/Card'

const Index = () => {
  const [roomURL, setRoomURL] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)
  const [isClickedCreateButton, setIsClickedCreateButton] = useState<boolean>(false)

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
          title='Create a Room'
        >
          <p>
            No account is required, just create a Room. It will expire in 24 hours.
          </p>
          <Button
            variant='contained'
            color='primary'
            disabled={isClickedCreateButton}
            onClick={() => createRoom()}
          >
            CREATE ROOM
          </Button>
        </Card>
        {roomURL && (
          <Card
            title='Join us'
          >
            <p>
              Create a Room and share the URL with your friends.
            </p>
            <a href={roomURL}>{roomURL}</a>
          </Card>
        )}
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

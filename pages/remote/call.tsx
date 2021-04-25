import React, { useEffect, useState, useRef } from "react"
import * as THREE from 'three'
import io from 'socket.io-client'
import styled from 'styled-components'
import { Button, Link } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import Video from '../../components/atoms/Video'
import WebGL from '../../src/WebGL'
import { createToolBar, onClickButton } from '../../threeComponents/molecules/createToolBar'
import { receiveMessagingHandler, sendMeshHandler } from '../../src/emitter/Messaging'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import Card from '../../components/molecules/Card'
import InputField from '../../components/atoms/InputField'
import AudioMedia from '../../src/AudioMedia'
import Painter from '../../src/Painter'

const Call = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [isAudioPermission, setIsAudioPermission] = useState(true)
  const [memberList, setMemberList] = useState<string[]>([])
  const [responseStatus, setResponseStatus] = useState<number>()
  const [hasError, setHasError] = useState<boolean>(false)
  const [expire, setExpire] = useState<number>(0)
  const [isCharLengthInRange, setIsCharLengthInRange] = useState<boolean>(false)
  const nameInput = useRef<HTMLInputElement>(null)

  const audioMedia = new AudioMedia()

  const onChangeNickname = (e) => {
    const value = e.target.value
    setIsCharLengthInRange(value.length > 0 && value.length < 15)
  }

  const onStartWebAR = async() => {
    const res = await fetch(`../api/call?name=${nameInput.current?.value}`)
    setResponseStatus(res.status)
    if(!res.ok) {
      const json = await res.json()
      console.error(new Error(json.message))
      return
    }

    try {
      await audioMedia.get()
    } catch (error) {
      console.error(error)
      setIsAudioPermission(false)
      return
    }

    const socket = await io()
    const canvas = document.getElementById('webAR') as HTMLCanvasElement
    const webGL = new WebGL(canvas)
    createToolBar(webGL.scene)
    receiveMessagingHandler(socket, webGL.scene, audioMedia, (list) => setMemberList(list))

    const session = await navigator['xr'].requestSession('immersive-ar', {
      requiredFeatures: ['local', 'hit-test']
    })
    const context: any = webGL.context
    await context.makeXRCompatible()
    webGL.renderer.xr.setReferenceSpaceType('local')
    webGL.renderer.xr.setSession(session)
    session.addEventListener('end', () => location.reload())

    const cursor = new THREE.Vector3()

    const controller = webGL.renderer.xr.getController(0)
    controller.userData.inputType = null
    controller.userData.skipFrames = 2

    controller.addEventListener('selectstart', () => {
      webGL.raycaster.setFromCamera(webGL.mouse, webGL.camera)
      const intersects = webGL.raycaster.intersectObjects(webGL.scene.children, true)
      if(intersects.length && intersects[0].object.name) {
        onClickButton(controller, intersects[0].object, audioMedia)
        return
      }

      const painter = new Painter('#ffffff')
      painter.setSize = 0.2
      webGL.scene.add(painter.mesh)
      controller.userData.painter = painter
      controller.userData.isSelecting = true
    })

    controller.addEventListener('selectend', () => {
      controller.userData.isSelecting = false
      controller.userData.skipFrames = 2

      const painter = controller.userData.painter
      const data = painter.mesh.toJSON()
      sendMeshHandler(socket, {
        vertices: JSON.stringify(data.geometries[0].data.attributes.position.array),
        color: data.materials[0].color
      })
    })

    const handleController = () => {
      if(!controller.userData.isSelecting) return

      cursor.set(controller.position.x, controller.position.y, controller.position.z).applyMatrix4( controller.matrixWorld )
      const painter = controller.userData.painter
      if(controller.userData.skipFrames >= 0) {
        controller.userData.skipFrames--
        painter.moveTo(cursor)
        return
      }

      painter.lineTo(cursor)
      painter.update()
    }

    webGL.renderer.setAnimationLoop(() => {
      handleController()
      webGL.renderer.render(webGL.scene, webGL.camera)
    })
  }

  useEffect(() => {
    (async() => {
      const res = await fetch('../api/getRoom')
      const json = await res.json()
      setResponseStatus(res.status)
      if(!res.ok) {
        console.error(new Error(json.message))
        return
      }
      setExpire(json.data.remainingTime)

      if(!navigator['xr']) {
        setIsSupported(false)
        return
      }
      const isSessionSupported = await navigator['xr'].isSessionSupported('immersive-ar')
      setIsSupported(isSessionSupported)
    })()
  }, [])

  useEffect(() => {
    setHasError(!isAudioPermission || responseStatus !== 200 || !isCharLengthInRange)
  }, [isAudioPermission, responseStatus, isCharLengthInRange])

  return (
    <>
      <Header />
      <Wrap>
        {memberList.map(id => (
          <Video id={id} key={id} hidden={true} />
        ))}
        {(expire > 0 && expire <= 6) && (
          <ErrorBox>
            <Alert variant="filled" severity="warning">
              This Room has 6 hours left to expire.<br />
              <Link href='/'>
                Create a new Room
              </Link>
            </Alert>
          </ErrorBox>
        )}
        {responseStatus && responseStatus !== 200 && (
          <>
            {responseStatus === 500 ? (
              <ErrorBox>
                <Alert variant="filled" severity="error">
                  Server error. Please try again after a while.
                </Alert>
              </ErrorBox>
            ) : (
              <ErrorBox>
                <Alert variant="filled" severity="error">
                  The URL is incorrect.<br />
                  Do you want to create a new room?<br />
                  <Link href='/'>
                    Create a Room
                  </Link>
                </Alert>
              </ErrorBox>
            )}
          </>
        )}
        {!isAudioPermission && (
          <ErrorBox>
            <Alert variant="filled" severity="error">
              Please allow the use of the microphone.
            </Alert>
          </ErrorBox>
        )}
        <span>Allow the use of the microphone and camera.</span>
        <Card
          title='Set your nickname.'
        >
          <InputField
            inputRef={nameInput}
            placeholder='Nickname'
            onChange={onChangeNickname}
            hasError={!!nameInput.current?.value && !isCharLengthInRange}
            errorMessage='Enter up to 15 characters.'
          />
          {isSupported ? (
            <Button
              variant='contained'
              color='primary'
              onClick={() => onStartWebAR()}
              disabled={hasError || !responseStatus}
            >
              START AR
            </Button>
          ) : (
            <a href='https://immersiveweb.dev/'>
              WebXR not available
            </a>
          )}
        </Card>
        <canvas id='webAR' hidden></canvas>
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

export default Call

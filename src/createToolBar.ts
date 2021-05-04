import * as THREE from 'three'
import { Object3D } from 'three'
import AudioMedia from './AudioMedia'
import ToolBar from '../threeComponents/molecules/ToolBar'
import { deleteAllMeshHandler } from './emitter/Messaging'

const colorPallet = {
  red: '#c31700',
  yellow: '#f5ec00',
  green: '#009e19',
  blue: '#00789e',
  pink: '#c000b9',
  black: '#141414',
  white: '#f2f2f2'
}

const buttonSize = {
  width: 0.01,
  height: 0.01,
  depth: 0.005
}

const onColorChange = (scene: THREE.Scene, controller: THREE.Group, name: string) => {
  const disabledmentButton = scene.getObjectByName(controller.userData.colorName)
  const clickedButton = scene.getObjectByName(name)
  if(disabledmentButton === undefined || clickedButton === undefined) return

  onPushIn(false, disabledmentButton)
  controller.userData.colorName = clickedButton.name
  controller.userData.colorCode = colorPallet[clickedButton.name]
  onPushIn(true, clickedButton)
}

const onPushIn = (hasPushIn: boolean, mesh: Object3D | undefined) => {
  if(mesh === undefined) return

  if(hasPushIn) {
    mesh.scale.z = 0.5
    mesh.position.z = 0
  }else {
    mesh.scale.z = 1
    mesh.position.z = buttonSize.depth / 2
  }
}

interface ButtonInfo {
  name: string
  color: string
  imgSrc?: string
  isDefaultSelected: boolean
  onClick: () => void
}

export const createToolBar = (scene: THREE.Scene, socket: SocketIOClient.Socket, audioMedia: AudioMedia, controller: THREE.Group) => {
  const buttonList: Array<ButtonInfo> = [
    {
      name: 'red',
      color: colorPallet.red,
      isDefaultSelected: false,
      onClick: () => {
        onColorChange(scene, controller, 'red')
      }
    },
    {
      name: 'yellow',
      color: colorPallet.yellow,
      isDefaultSelected: false,
      onClick: () => {
        onColorChange(scene, controller, 'yellow')
      }
    },
    {
      name: 'green',
      color: colorPallet.green,
      isDefaultSelected: false,
      onClick: () => {
        onColorChange(scene, controller, 'green')
      }
    },
    {
      name: 'blue',
      color: colorPallet.blue,
      isDefaultSelected: false,
      onClick: () => {
        onColorChange(scene, controller, 'blue')
      }
    },
    {
      name: 'pink',
      color: colorPallet.pink,
      isDefaultSelected: false,
      onClick: () => {
        onColorChange(scene, controller, 'pink')
      }
    },
    {
      name: 'black',
      color: colorPallet.black,
      isDefaultSelected: false,
      onClick: () => {
        onColorChange(scene, controller, 'black')
      }
    },
    {
      name: 'white',
      color: colorPallet.white,
      isDefaultSelected: true,
      onClick: () => {
        onColorChange(scene, controller, 'white')
      }
    },
    {
      name: 'trash',
      color: '#7d7d7d',
      imgSrc: '/textures/trash.png',
      isDefaultSelected: false,
      onClick: () => {
        deleteAllMeshHandler(socket)
      }
    },
    {
      name: 'mic',
      color: '#7d7d7d',
      imgSrc: '/textures/mic.png',
      isDefaultSelected: true,
      onClick: () => {
        const enabled = audioMedia.switching()
        onPushIn(enabled, scene.getObjectByName('mic'))
      }
    },
    {
      name: 'exit',
      color: '#7d7d7d',
      imgSrc: '/textures/exit.png',
      isDefaultSelected: false,
      onClick: () => {
        location.reload()
      }
    },
  ]

  const toolBar = new ToolBar(buttonList, buttonSize).execute()
  if(toolBar === null) return

  toolBar.position.set(0, -0.1, -0.1)
  scene.add(toolBar)
}

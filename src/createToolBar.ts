import * as THREE from 'three'
import { Object3D } from 'three'
import AudioMedia from './AudioMedia'
import ToolBar from '../threeComponents/molecules/ToolBar'
import { deleteAllMeshHandler } from './emitter/Messaging'

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
  controller.userData.colorCode = clickedButton.userData.colorCode
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
      color: '#c31700',
      isDefaultSelected: false,
      onClick: () => {
        onColorChange(scene, controller, 'red')
      }
    },
    {
      name: 'yellow',
      color: '#f5ec00',
      isDefaultSelected: false,
      onClick: () => {
        onColorChange(scene, controller, 'yellow')
      }
    },
    {
      name: 'green',
      color: '#009e19',
      isDefaultSelected: false,
      onClick: () => {
        onColorChange(scene, controller, 'green')
      }
    },
    {
      name: 'blue',
      color: '#00789e',
      isDefaultSelected: false,
      onClick: () => {
        onColorChange(scene, controller, 'blue')
      }
    },
    {
      name: 'pink',
      color: '#c000b9',
      isDefaultSelected: false,
      onClick: () => {
        onColorChange(scene, controller, 'pink')
      }
    },
    {
      name: 'black',
      color: '#141414',
      isDefaultSelected: false,
      onClick: () => {
        onColorChange(scene, controller, 'black')
      }
    },
    {
      name: 'white',
      color: '#f2f2f2',
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

import {
  Scene,
  Group,
  BoxGeometry,
  Mesh
} from 'three'
import AudioMedia from './AudioMedia'
import ToolBar from '../threeComponents/molecules/ToolBar'
import { deleteAllMeshHandler, deleteMeshHandler } from './emitter/Messaging'

const onColorChange = (scene: Scene, controller: Group, name: string) => {
  const disabledmentButton = scene.getObjectByName(controller.userData.colorName) as Mesh | undefined
  const clickedButton = scene.getObjectByName(name) as Mesh | undefined
  if(disabledmentButton === undefined || clickedButton === undefined) return

  onPushIn(false, disabledmentButton)
  controller.userData.colorName = clickedButton.name
  controller.userData.colorCode = clickedButton.userData.colorCode
  onPushIn(true, clickedButton)
}

const onPushIn = (hasPushIn: boolean, mesh: Mesh) => {
  if(hasPushIn) {
    mesh.scale.z = 0.5
    mesh.position.z = 0
  }else {
    mesh.scale.z = 1
    const geometry = mesh.geometry as BoxGeometry
    mesh.position.z = (geometry.parameters.depth) / 2
  }
}

interface ButtonInfo {
  name: string
  color: string
  imgSrc?: string
  isDefaultSelected: boolean
  onClick: () => void
}

export const createToolBar = (
    scene: Scene,
    socket: SocketIOClient.Socket,
    audioMedia: AudioMedia,
    controller: Group
  ) => {
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
        controller.userData.history.deleteAll()
      }
    },
    {
      name: 'back',
      color: '#7d7d7d',
      imgSrc: '/textures/back.png',
      isDefaultSelected: false,
      onClick: () => {
        const lineId = controller.userData.history.back()
        const deleteLine = scene.getObjectByName(lineId)
        if(!deleteLine) return
        deleteMeshHandler(socket, lineId)
        scene.remove(deleteLine)
      }
    },
    {
      name: 'mic',
      color: '#7d7d7d',
      imgSrc: '/textures/mic.png',
      isDefaultSelected: true,
      onClick: () => {
        const enabled = audioMedia.switching()
        const mic = scene.getObjectByName('mic') as Mesh | undefined
        if(mic === undefined) return
        onPushIn(enabled, mic)
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

  const toolBar = new ToolBar(buttonList, {
    width: 0.01,
    height: 0.01,
    depth: 0.005
  }).execute()
  if(toolBar === null) return

  toolBar.position.set(0, -0.1, -0.1)
  scene.add(toolBar)
}

import * as THREE from 'three'
import { Color, Object3D } from 'three'
import Button from '../atoms/Button'
import AudioMedia from '../../src/AudioMedia'

const colorPallet = {
  red: '#c31700',
  yellow: '#f5ec00',
  green: '#009e19',
  blue: '#00789e',
  pink: '#c000b9',
  black: '#141414',
  white: '#f2f2f2'
}

export const onClickButton = (controller: THREE.Group, button: Object3D, audioMedia: AudioMedia) => {
  switch(button.userData.type) {
    case 'mic': {
      const enabled = audioMedia.switching()
      onPushIn(enabled, button)
      break
    }
    case 'exit': {
      location.reload()
      break
    }
    case 'color': {
      const clickedButtonIndex = buttonList.findIndex(info => info.name === button.name)
      const isSelected = buttonList[clickedButtonIndex].isSelected
      onPushIn(!isSelected, button)
      buttonList[clickedButtonIndex].isSelected = !isSelected
      controller.userData.color = colorPallet[button.name]
      break
    }
  }
}

const onPushIn = (hasPushIn: boolean, mesh: Object3D) => {
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
  type: string
  color: string
  imgSrc?: string
  isSelected: boolean
}

const buttonList: Array<ButtonInfo> = [
  {
    name: 'red',
    type: 'color',
    color: colorPallet.red,
    isSelected: false
  },
  {
    name: 'yellow',
    type: 'color',
    color: colorPallet.yellow,
    isSelected: false
  },
  {
    name: 'green',
    type: 'color',
    color: colorPallet.green,
    isSelected: false
  },
  {
    name: 'blue',
    type: 'color',
    color: colorPallet.blue,
    isSelected: false
  },
  {
    name: 'pink',
    type: 'color',
    color: colorPallet.pink,
    isSelected: false
  },
  {
    name: 'black',
    type: 'color',
    color: colorPallet.black,
    isSelected: false
  },
  {
    name: 'white',
    type: 'color',
    color: colorPallet.white,
    isSelected: true
  },
  {
    name: 'mic',
    type: 'mic',
    color: '#7d7d7d',
    imgSrc: '/textures/mic.png',
    isSelected: true
  },
  {
    name: 'exit',
    type: 'exit',
    color: '#7d7d7d',
    imgSrc: '/textures/exit.png',
    isSelected: false
  },
]

const buttonSize = {
  width: 0.01,
  height: 0.01,
  depth: 0.005
}

const basePosition = {
  x: 0,
  y: -0.1,
  z: -0.1
}

// const rotateX = 0
const originalMargin = 0.002

const centeringAdjustment = buttonList.length === 1
  ? 0
  : ((buttonSize.width + originalMargin)/2) * (buttonList.length - 1)

export const createToolBar = (scene: THREE.Scene) => {
  if(!buttonList.length) return

  const group = new THREE.Group()
  group.position.set(
    basePosition.x,
    basePosition.y,
    basePosition.z
  )

  const geometry = new THREE.PlaneGeometry(
    (buttonList.length * buttonSize.width) + ((buttonList.length - 1) * originalMargin) + 0.01,
    buttonSize.height + 0.005
  )
  const material = new THREE.MeshBasicMaterial({
    color: new Color('#ffffff'),
    transparent: true,
    opacity: 0.5
  })
  const panel = new THREE.Mesh(geometry, material)
  group.add(panel)

  buttonList.forEach(({name, type, color, imgSrc, isSelected}, index) => {
    const margin = index === 0 ? 0 : index * originalMargin
    const button = new Button(name, color, buttonSize, imgSrc).execute()
    button.userData.type = type
    button.position.set(
      (index * buttonSize.width) + margin - centeringAdjustment,
      0,
      isSelected ? 0 : buttonSize.depth / 2
    )
    isSelected && (button.scale.z = 0.5)
    group.add(button)
  })
  scene.add(group)
}

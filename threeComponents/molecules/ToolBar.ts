import {
  PlaneGeometry,
  MeshBasicMaterial,
  Color,
  Mesh,
  Group
} from 'three'
import Button from '../atoms/Button'

interface ButtonInfo {
  name: string
  color: string
  imgSrc?: string
  isDefaultSelected: boolean
  onClick: () => void
}

interface ButtonSize {
  width: number
  height: number
  depth: number
}

class ToolBar {
  buttonList: Array<ButtonInfo>
  buttonSize: ButtonSize

  constructor(buttonList: Array<ButtonInfo>, buttonSize: ButtonSize) {
    this.buttonList = buttonList
    this.buttonSize = buttonSize
  }

  execute() {
    if(this.buttonList.length === 0) return null

    const BUTTON_MARGIN = 0.002
    const PADDING_BESIDE = 0.01
    const PADDING_VERTICAL = 0.005

    const geometry = new PlaneGeometry(
      (this.buttonList.length * this.buttonSize.width)
        + ((this.buttonList.length - 1) * BUTTON_MARGIN)
        + PADDING_BESIDE,
      this.buttonSize.height + PADDING_VERTICAL
    )
    const material = new MeshBasicMaterial({
      color: new Color('#ffffff'),
      transparent: true,
      opacity: 0.5
    })
    const panel = new Mesh(geometry, material)

    const ORIGIN_MARGIN = 0.002
    const buttonGroup = new Group()
    this.buttonList.forEach(({ name, color, imgSrc, isDefaultSelected, onClick }, index) => {
      const margin = index * ORIGIN_MARGIN
      const button = new Button(name, color, this.buttonSize, imgSrc).execute()
      button.addEventListener('click', () => onClick())
      button.position.set(
        (index * this.buttonSize.width) + margin,
        0,
        isDefaultSelected ? 0 : this.buttonSize.depth / 2
      )
      if(isDefaultSelected) {
        button.scale.z = 0.5
      }
      buttonGroup.add(button)
    })

    if(this.buttonList.length > 1) {
      // centering
      buttonGroup.position.set(
        (this.buttonSize.width / 2) - ((
          (this.buttonList.length * this.buttonSize.width)
          + ((this.buttonList.length - 1) * ORIGIN_MARGIN)
        ) / 2),
        0,
        0
      )
    }

    return new Group().add(panel, buttonGroup)
  }
}

export default ToolBar

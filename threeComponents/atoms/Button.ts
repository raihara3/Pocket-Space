import {
  BoxGeometry,
  MeshBasicMaterial,
  Color,
  TextureLoader,
  Mesh
} from 'three'

class Button {
  name: string
  color: string
  imgSrc?: string
  size: {
    width: number
    height: number
    depth: number
  }

  constructor(name: string, color: string, size: any, imgSrc?: string) {
    this.name = name
    this.color = color
    this.imgSrc = imgSrc
    this.size = size
  }

  execute() {
    const geometry = new BoxGeometry(this.size.width, this.size.height, this.size.depth)
    const colorTexture = new MeshBasicMaterial({color: new Color(this.color)})
    const material = [
      colorTexture,
      colorTexture,
      colorTexture,
      colorTexture,
      this.imgSrc ? new MeshBasicMaterial({map: new TextureLoader().load(this.imgSrc)}) : colorTexture,
      colorTexture,
    ]
    const mesh = new Mesh(geometry, material)
    mesh.name = this.name
    return mesh
  }
}

export default Button

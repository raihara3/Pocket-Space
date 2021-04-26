import * as THREE from 'three'
import { Color } from 'three'

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
    const geometry = new THREE.BoxGeometry(this.size.width, this.size.height, this.size.depth)
    const colorTexture = new THREE.MeshBasicMaterial({color: new Color(this.color)})
    const material = [
      colorTexture,
      colorTexture,
      colorTexture,
      colorTexture,
      this.imgSrc ? new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(this.imgSrc)}) : colorTexture,
      colorTexture,
    ]
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = this.name
    return mesh
  }
}

export default Button

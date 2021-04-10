import * as THREE from 'three'
import { BufferGeometry } from 'three'

export interface Painter {
  vertices: any,
  color: number,
}

export const parssePainter = async(scene: THREE.Scene, dataList: Array<Painter>) => {
  if(!dataList.length) return

  await dataList.forEach(({ vertices, color }) => {
    const verticesArray = vertices.split(',')
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verticesArray), 3))
    const material = new THREE.MeshBasicMaterial({color: color})
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
  })
}

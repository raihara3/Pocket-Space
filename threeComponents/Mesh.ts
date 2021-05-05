import * as THREE from 'three'
import { BufferGeometry } from 'three'

export interface Painter {
  name: string,
  vertices: any,
  color: number,
}

export const parssePainter = async(scene: THREE.Scene, dataList: Array<Painter>) => {
  if(!dataList.length) return

  await dataList.forEach(({ name, vertices, color }) => {
    const verticesArray = JSON.parse(vertices)
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verticesArray), 3))
    const material = new THREE.MeshBasicMaterial({color: color})
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = name
    scene.add(mesh)
  })
}

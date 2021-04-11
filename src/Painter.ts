import {
  BufferAttribute,
  DynamicDrawUsage,
  BufferGeometry,
  MeshBasicMaterial,
  Color,
  Mesh,
  Vector3,
  Matrix4
} from 'three'

class Cursor {
  mesh: Mesh
  geometry: BufferGeometry
  position: BufferAttribute
  color: string

  constructor(color: string) {
    const bufferSize = 40000

    this.position = new BufferAttribute(new Float32Array(bufferSize), 3)
    this.position.usage = DynamicDrawUsage
    this.geometry = new BufferGeometry()
    this.geometry.setAttribute('position', this.position)
    this.geometry.drawRange.count = 0
    const material = new MeshBasicMaterial({color: new Color(color)})

    this.mesh = new Mesh(this.geometry, material)
    this.mesh.frustumCulled = false

    this.color = color
  }

  get getCursor() {
    return this.mesh
  }

  get getColor() {
    return this.color
  }
}

const getPoints = (size: number) => {
  const PI2 = Math.PI * 2
  const sides = 10
  const array: Array<Vector3> = []
  const radius = 0.01 * size

  for(let i = 0; i < sides; i++) {
    const angle = (i / sides) * PI2
    array.push(new Vector3(Math.sin(angle) * radius, Math.cos(angle) * radius, 0))
  }
  return array
}

class Painter extends Cursor {
  target: Vector3
  eye: Vector3
  matrix1: Matrix4
  matrix2: Matrix4
  count: number
  size: number

  constructor(color: string) {
    super(color)

    this.target = new Vector3()
    this.eye = new Vector3()

    this.matrix1 = new Matrix4()
    this.matrix2 = new Matrix4()

    this.count = 0
    this.size = 0.5
  }

  set setSize(size: number) {
    this.size = size
  }

  private stroke() {
    if (this.eye.distanceToSquared(this.target) === 0 ) return

    const vector1 = new Vector3()
		const vector2 = new Vector3()
		const vector3 = new Vector3()
		const vector4 = new Vector3()
    let count = this.geometry.drawRange.count
    const points = getPoints(this.size)

    for(let i = 0; i < points.length; i++) {
      const vertex1 = points[i]
      const vertex2 = points[(i + 1) % points.length]

      vector1.copy(vertex1).applyMatrix4(this.matrix2).add(this.eye)
			vector2.copy(vertex2).applyMatrix4(this.matrix2).add(this.eye)
			vector3.copy(vertex2).applyMatrix4(this.matrix1).add(this.target)
			vector4.copy(vertex1).applyMatrix4(this.matrix1).add(this.target)

			vector1.toArray(this.position.array, (count + 0) * 3)
			vector2.toArray(this.position.array, (count + 1) * 3)
			vector4.toArray(this.position.array, (count + 2) * 3)

			vector2.toArray(this.position.array, (count + 3) * 3)
			vector3.toArray(this.position.array, (count + 4) * 3)
			vector4.toArray(this.position.array, (count + 5) * 3)

      count += 6
    }
    this.geometry.drawRange.count = count
  }

  private update() {
    const start = this.count
    const end = this.geometry.drawRange.count
    if(start === end) return

    this.position.updateRange.offset = start * 3
    this.position.updateRange.count = (end - start) * 3
    this.position.needsUpdate = true
    this.count = this.geometry.drawRange.count
  }

  moveTo(position: Vector3) {
    this.target.copy(position)
    this.matrix1.lookAt(this.eye, this.target, new Vector3(0, 1, 0))
    this.eye.copy(position)
    this.matrix2.copy(this.matrix1)
  }

  lineTo(position: Vector3) {
    this.target.copy(position)
    this.matrix1.lookAt(this.eye, this.target, new Vector3(0, 1, 0))
    this.stroke()
    this.eye.copy(this.target)
    this.matrix2.copy(this.matrix1)
    this.update()
  }
}

export default Painter

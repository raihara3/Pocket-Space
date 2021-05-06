import * as THREE from 'three'

class WebGL {
  public context: WebGLRenderingContext
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera
  public raycaster: THREE.Raycaster
  public mouse: THREE.Vector2
  public renderer: THREE.WebGLRenderer

  constructor(canvas) {
    this.context = canvas.getContext('webgl')
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    )
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.xr.enabled = true
    this.renderer.xr.setReferenceSpaceType('local')

    const aspect = window.innerWidth / window.innerHeight
    window.addEventListener(
      'resize',
      () => {
        this.camera.aspect = aspect
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
      },
      false
    )
  }
}

export default WebGL

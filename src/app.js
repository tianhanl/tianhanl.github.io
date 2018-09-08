global.THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const createBunnyGeometry = require('./createBunnyGeometry');

class App {
  constructor(canvasContainer, config) {
    this.container = canvasContainer || document.body;
    const { height, width, vertexShader, fragmentShader } = config;
    // set up envrionment
    this.uniforms = {
      color: {
        type: 'v3',
        value: new THREE.Color('#A8A8A8')
      },
      u_time: { type: 'f', value: 1.0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2() },
      u_mouse: { type: 'v2', value: new THREE.Vector2() }
    };
    this.scene = this.createScene(height, width);
    this.camera = this.createCamera();
    this.renderer = this.createRender();
    this.container.appendChild(this.renderer.domElement);
    this.orbitControls = new OrbitControls(this.camera);
    this.orbitControls.autoRotate = true;

    // add objects
    this.addObjs(vertexShader, fragmentShader);
    window.addEventListener(
      'resize',
      this.handleWindowResize.bind(this),
      false
    );
    this.render();
  }

  createScene(height, width) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.uniforms.u_resolution.value.x = this.WIDTH;
    this.uniforms.u_resolution.value.y = this.HEIGHT;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x171a22, 0.007);
    return scene;
  }

  createCamera() {
    let aspectRatio = this.WIDTH / this.HEIGHT;
    let fieldOfView = 60;
    let nearPlane = 0.01;
    let farPlane = 300;
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );
    camera.position.x = 0;
    camera.position.z = 15;
    camera.position.y = 0;
    return camera;
  }
  createRender() {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setClearColor(this.scene.fog.color);
    renderer.setSize(this.WIDTH, this.HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    return renderer;
  }

  handleWindowResize() {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    this.uniforms.u_resolution.value.x = this.WIDTH;
    this.uniforms.u_resolution.value.y = this.HEIGHT;
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }

  addObjs(vertexShader, fragmentShader) {
    let obj = createBunnyGeometry({ flat: true });
    let mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    let points = new THREE.Points(obj, mat);
    this.scene.add(points);
  }

  render() {
    this.uniforms.u_time.value += 0.05;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => {
      this.render();
    });
  }
}
module.exports = App;

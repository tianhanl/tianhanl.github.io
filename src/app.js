global.THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const createBunnyGeometry = require('./createBunnyGeometry');

class App {
  constructor(canvasContainer, config) {
    this.container = canvasContainer || document.body;
    const { height, width, vertexShader, fragmentShader } = config;
    // set up envrionment
    this.scene = this.createScene(height, width);
    this.camera = this.createCamera();
    this.renderer = this.createRender();
    this.container.appendChild(this.renderer.domElement);
    window.addEventListener(
      'resize',
      this.handleWindowResize.bind(this),
      false
    );
    this.orbitControls = new OrbitControls(this.camera);
    this.orbitControls.autoRotate = true;

    // add objects
    this.createLights();
    this.addObjs(vertexShader, fragmentShader);
    this.render();
  }

  createScene(height, width) {
    this.HEIGHT = height;
    this.WIDTH = width;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#090918', 1, 600);
    return scene;
  }

  createCamera() {
    let aspectRatio = this.WIDTH / this.HEIGHT;
    let fieldOfView = 60;
    let nearPlane = 0.01;
    let farPlane = 1000;
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );
    camera.position.x = 0;
    camera.position.z = 6;
    camera.position.y = 0;
    return camera;
  }
  createRender() {
    const renderer = new THREE.WebGLRenderer({
      // 在 css 中设置背景色透明显示渐变色
      alpha: true,
      // 开启抗锯齿
      antialias: true
    });
    renderer.setClearColor(this.scene.fog.color);
    renderer.setSize(this.WIDTH, this.HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    return renderer;
  }

  createLights() {
    // 户外光源
    // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
    this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

    // 环境光源
    this.ambientLight = new THREE.AmbientLight(0xdc8874, 0.2);

    // 方向光是从一个特定的方向的照射
    // 类似太阳，即所有光源是平行的
    // 第一个参数是关系颜色，第二个参数是光源强度
    this.shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

    // 设置光源的位置方向
    this.shadowLight.position.set(50, 50, 50);

    // 开启光源投影
    this.shadowLight.castShadow = true;

    // 定义可见域的投射阴影
    this.shadowLight.shadow.camera.left = -400;
    this.shadowLight.shadow.camera.right = 400;
    this.shadowLight.shadow.camera.top = 400;
    this.shadowLight.shadow.camera.bottom = -400;
    this.shadowLight.shadow.camera.near = 1;
    this.shadowLight.shadow.camera.far = 1000;

    // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
    this.shadowLight.shadow.mapSize.width = 2048;
    this.shadowLight.shadow.mapSize.height = 2048;

    // 为了使这些光源呈现效果，需要将它们添加到场景中
    this.scene.add(this.hemisphereLight);
    this.scene.add(this.shadowLight);
    this.scene.add(this.ambientLight);
  }

  handleWindowResize() {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }

  addObjs(vertexShader, fragmentShader) {
    let obj = createBunnyGeometry({ flat: true });
    let uniforms = {
      color: {
        type: 'v3',
        value: new THREE.Color('#F07883')
      }
    };
    let mat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    let particleSystem = new THREE.Mesh(obj, mat);
    this.scene.add(particleSystem);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => {
      this.render();
    });
  }
}
module.exports = App;

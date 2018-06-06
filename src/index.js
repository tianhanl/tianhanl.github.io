const App = require('./app');

const vertexShader = `varying float opacity; void main() {gl_PointSize = 2. - 2. * position.z / 20.;gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);opacity=position.z/5.;}`;
const fragmentShader =
  'uniform vec3 color; varying float opacity; void main() {gl_FragColor = vec4(color, opacity);}';

const app = new App(null, {
  height: window.innerHeight,
  width: window.innerWidth,
  vertexShader,
  fragmentShader
});

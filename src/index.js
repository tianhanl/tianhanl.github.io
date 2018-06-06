const App = require('./app');

const vertexShader = `
varying vec3 vNormal;

void main () {
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragmentShader = `
varying vec3 vNormal;

void main () {
  gl_FragColor = vec4(vNormal, 1.0);
}
 
`;

const app = new App(null, {
  height: window.innerHeight,
  width: window.innerWidth,
  vertexShader,
  fragmentShader
});

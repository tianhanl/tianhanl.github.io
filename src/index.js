const App = require('./app');

const vertexShader = `
uniform float u_time;
uniform float u_pct;
varying vec3 vNormal;

void main () {
  vNormal = normal;
  gl_PointSize = 2. + .4 * sin(position.x * position.y * position.z +  u_time);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragmentShader = `
#define TWO_PI 6.28318530718

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 color;
varying vec3 vNormal;
void main () {
  float opacity = 0.5 + 0.3 * sin(vNormal.x * vNormal.y * u_time);
  gl_FragColor = vec4(color, opacity);
}
 
`;

const app = new App(null, {
  height: window.innerHeight,
  width: window.innerWidth,
  vertexShader,
  fragmentShader
});

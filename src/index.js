const App = require('./app');

const vertexShader = `
uniform float u_time;
varying vec3 vNormal;

void main () {
  vNormal = normal;
  gl_PointSize = 2. + .2 * sin(position.x * position.y * position.z +  u_time);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragmentShader = `
#define TWO_PI 6.28318530718

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 color;
varying vec3 vNormal;
vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

vec3 hsb2rgb( in vec3 c ){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                           6.0)-3.0)-1.0,
                   0.0,
                   1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main () {
  float opacity = 0.5 + 0.2 * sin(vNormal.x * vNormal.y * u_time);
  gl_FragColor = vec4(color, opacity);
}
 
`;

const app = new App(null, {
  height: window.innerHeight,
  width: window.innerWidth,
  vertexShader,
  fragmentShader
});

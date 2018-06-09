const data = require('three-buffer-vertex-data');
const unindex = require('unindex-mesh');
const primitive = require('bunny');

module.exports = function(opt = {}) {
  const geometry = new THREE.BufferGeometry();

  // Sharing normals gives us a smooth look, splitting
  // them gives us a faceted look
  if (opt.flat) {
    data.attr(geometry, 'position', unindex(primitive));
  } else {
    data.index(geometry, primitive.cells);
    data.attr(geometry, 'position', primitive.positions);
  }
  geometry.center();
  geometry.scale(1, 1, 1);
  geometry.computeVertexNormals();

  return geometry;
};

// code from repo
// jam3-lession-webgl-shader-threejs

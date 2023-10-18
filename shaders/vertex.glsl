uniform float time;
uniform float uProgress;

uniform vec2 uResolution;
uniform vec2 uQuadSize;


varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 defaultState = modelMatrix * vec4(position, 1.0);
  vec4 fullScreenPosition = vec4(position, 1.0);
  fullScreenPosition.x *= uResolution.x/uQuadSize.x;
  fullScreenPosition.y *= uResolution.y/uQuadSize.y;

  vec4 finalPosition = mix(defaultState,fullScreenPosition,uProgress);


  gl_Position = projectionMatrix * viewMatrix * finalPosition;
}

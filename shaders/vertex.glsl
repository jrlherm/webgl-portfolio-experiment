uniform float time;
uniform float uProgress;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 defaultState = modelMatrix * vec4(position, 1.0);
  vec4 fullScreenPosition = vec4(position, 1.0);
  vec4 finalPosition = mix(defaultState,fullScreenPosition,uProgress);


  gl_Position = projectionMatrix * viewMatrix * finalPosition;
}

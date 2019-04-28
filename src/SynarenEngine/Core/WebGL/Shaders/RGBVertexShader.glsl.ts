export default `
attribute vec2 a_position;
attribute vec3 a_color;
varying vec3 v_color;
uniform mat4 u_model;
void main(void) {
  colorOutput = a_color;
  gl_Position = u_model * vec4(a_position, 1, 1);
}
`;

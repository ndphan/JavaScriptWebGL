export default `
attribute vec3 a_position;
attribute vec3 a_color;
varying vec3 v_color;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

void main(void) {
  v_color = a_color;
  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1);
}
`;

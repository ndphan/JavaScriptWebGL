export default `
attribute vec3 a_position;
attribute vec2 a_texture_coords;
varying vec2 v_texture_coords;
uniform mat4 u_view_model;
uniform mat4 u_projection;

void main(void) {
  v_texture_coords = a_texture_coords;
  gl_Position = u_projection * u_view_model * vec4(a_position, 1);
}
`;

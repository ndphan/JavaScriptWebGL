
precision mediump int;
precision mediump float;

attribute vec3 a_position;
attribute vec2 a_texture_coords;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;
varying vec2 v_texture_coords;

void main(void) {
  v_texture_coords = a_texture_coords;
  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
}


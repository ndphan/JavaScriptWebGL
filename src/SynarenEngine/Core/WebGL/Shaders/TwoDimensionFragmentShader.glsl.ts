export default `
precision mediump float;
precision mediump int;
varying vec2 v_texture_coords;
uniform sampler2D texture;
void main(void) {
  vec4 texel = texture2D(texture, v_texture_coords);
  gl_FragColor = texel;
}
`;

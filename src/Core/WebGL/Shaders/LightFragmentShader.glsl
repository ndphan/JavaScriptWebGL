
precision mediump float;
precision mediump int;

varying vec2 v_texture_coords;
varying vec3 v_normal;

varying vec3 v_light1_pos;
varying vec3 v_light1_intensities;
varying float v_light1_ambient_coefficient;
varying float v_diffuseCoefficient;
varying float v_attenuation;

uniform sampler2D texture;
uniform sampler2D shadowMap;

void main(void) {
  vec3 n = normalize(v_normal);
  vec3 l = normalize(v_light1_pos);
  float cosTheta = clamp(dot(n, l), 0.0, 1.0);

  vec4 surfaceColor = texture2D(texture, v_texture_coords);
  vec3 diffuse = v_diffuseCoefficient * surfaceColor.rgb * v_light1_intensities;
  vec3 ambient = v_light1_ambient_coefficient * surfaceColor.rgb * v_light1_intensities;

  vec3 linearColor = ambient + v_attenuation * diffuse * cosTheta;

  gl_FragColor = vec4(linearColor, surfaceColor.a);
}


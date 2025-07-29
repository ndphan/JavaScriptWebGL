precision mediump float;
precision mediump int;

varying vec2 v_texture_coords;
varying vec3 v_position;
varying vec3 v_normal;
varying mat4 v_model;

varying vec3 v_light1_pos;
varying vec3 v_light1_intensities;
varying float v_light1_attenuation;
varying float v_light1_ambient_coefficient;
varying float v_diffuseCoefficient;
varying float v_attenuation;

uniform sampler2D texture;
uniform sampler2D shadowMap;
uniform float numLights;

uniform bool u_isLightingEnabled;

struct Light {
  vec3 position;
  vec3 intensities;
  float ambientCoefficient;
  float attenuation;
};

void main(void) {
  if (!u_isLightingEnabled) {
    vec4 surfaceColor = texture2D(texture, v_texture_coords);
    gl_FragColor = surfaceColor;
    return;
  }

  Light light1;
  light1.intensities = v_light1_intensities;
  light1.position = v_light1_pos;
  light1.attenuation = v_light1_attenuation;
  light1.ambientCoefficient = v_light1_ambient_coefficient;

  vec3 n = normalize(v_normal);
  vec3 l = normalize(v_light1_pos);
  float cosTheta = clamp(dot(n, l), 0.0, 1.0);

  vec4 surfaceColor = texture2D(texture, v_texture_coords);
  vec3 diffuse = v_diffuseCoefficient * surfaceColor.rgb * light1.intensities;
  vec3 ambient = light1.ambientCoefficient * surfaceColor.rgb * light1.intensities;

  vec3 linearColor = ambient + v_attenuation * diffuse * cosTheta;

  vec3 gamma = vec3(1.0 / 2.2);
  gl_FragColor = vec4(pow(linearColor, gamma), surfaceColor.a);
}
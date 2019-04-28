export default `
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
varying vec4 v_shadow_pos;

uniform sampler2D texture;
uniform sampler2D shadowMap;
uniform float numLights;

struct Light {
  vec3 position;
  vec3 intensities;
  float ambientCoefficient;
  float attenuation;
};

float decodeFloat(vec4 color) {
  const vec4 bitShift = vec4(
    1.0 / (256.0 * 256.0 * 256.0),
    1.0 / (256.0 * 256.0),
    1.0 / 256.0,
    1
  );
  return dot(color, bitShift);
}

float random(vec3 seed, int i) {
  vec4 seed4 = vec4(seed, i);
  float dot_product = dot(seed4, vec4(12.9898, 78.233, 45.164, 94.673));
  return fract(sin(dot_product) * 43758.5453);
}

vec2 poisson(int index) {
  if (index == 0)
    return vec2(-0.94201624, -0.39906216);
  if (index == 1)
    return vec2(0.94558609, -0.76890725);
  if (index == 2)
    return vec2(-0.094184101, -0.92938870);
  if (index == 3)
    return vec2(0.34495938, 0.29387760);
  if (index == 4)
    return vec2(-0.91588581, 0.45771432);
  if (index == 5)
    return vec2(-0.81544232, -0.87912464);
  if (index == 6)
    return vec2(-0.38277543, 0.27676845);
  if (index == 7)
    return vec2(0.97484398, 0.75648379);
  if (index == 8)
    return vec2(0.44323325, -0.97511554);
  if (index == 9)
    return vec2(0.53742981, -0.47373420);
  if (index == 10)
    return vec2(-0.26496911, -0.41893023);
  if (index == 11)
    return vec2(0.79197514, 0.19090188);
  if (index == 12)
    return vec2(-0.24188840, 0.99706507);
  if (index == 13)
    return vec2(-0.81409955, 0.91437590);
  if (index == 14)
    return vec2(0.19984126, 0.78641367);
  if (index == 15)
    return vec2(0.14383161, -0.14100790);
  return vec2(0, 0);
}

float unpackRGBAToDepth(const vec4 v) {
  const float UnpackDownscale = 255. / 256.;
  const vec3 PackFactors = vec3(256. * 256. * 256., 256. * 256., 256.);
  const vec4 UnpackFactors = UnpackDownscale / vec4(PackFactors, 1.);
  return dot(v, UnpackFactors);
}

void main(void) {
  Light light1;
  light1.intensities = v_light1_intensities;
  light1.position = v_light1_pos;
  light1.attenuation = v_light1_attenuation;
  light1.ambientCoefficient = v_light1_ambient_coefficient;

  vec4 surfaceColor = texture2D(texture, v_texture_coords);
  vec3 diffuse = v_diffuseCoefficient * surfaceColor.rgb * light1.intensities;
  vec3 ambient = light1.ambientCoefficient * surfaceColor.rgb * light1.intensities;
  vec3 n = normalize(v_normal);
  vec3 l = normalize(v_light1_pos);
  float cosTheta = clamp(dot(n, l), 0.0, 1.0);

  const float texelSize = 1.0 / 1024.0;

  float amountInLight = 0.0;

  vec3 fragmentDepth = v_shadow_pos.xyz / v_shadow_pos.w;
  const float shadowAcneRemover = 0.001;
  fragmentDepth.z -= shadowAcneRemover;

  float soften = 0.0;
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      float texelDepth = unpackRGBAToDepth(texture2D(shadowMap, fragmentDepth.xy + vec2(x, y) * texelSize));
      soften += 1.0;
      if (fragmentDepth.z < texelDepth) {
        amountInLight += 1.0;
      }
    }
  }

  amountInLight /= soften;

  vec3 linearColor = ambient + amountInLight * v_attenuation * diffuse * cosTheta;
  vec3 gamma = vec3(1.0 / 2.2);
  gl_FragColor = vec4(pow(linearColor, gamma), surfaceColor.a);
}`;

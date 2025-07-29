precision mediump int;
precision mediump float;

attribute vec3 a_position;
attribute vec2 a_texture_coords;
attribute vec3 a_normal;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;

uniform vec3 u_light1_pos;
uniform vec3 u_light1_intensities;
uniform float u_light1_attenuation;
uniform float u_light1_ambient_coefficient;

uniform bool u_isLightingEnabled;

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

struct Light {
  vec3 position;
  vec3 intensities;
  float ambientCoefficient;
  float attenuation;
};

float transpose(float m) {
  return m;
}

mat2 transpose(mat2 m) {
  return mat2(m[0][0], m[1][0],
    m[0][1], m[1][1]);
}

mat3 transpose(mat3 m) {
  return mat3(m[0][0], m[1][0], m[2][0],
    m[0][1], m[1][1], m[2][1],
    m[0][2], m[1][2], m[2][2]);
}

mat4 transpose(mat4 m) {
  return mat4(m[0][0], m[1][0], m[2][0], m[3][0],
    m[0][1], m[1][1], m[2][1], m[3][1],
    m[0][2], m[1][2], m[2][2], m[3][2],
    m[0][3], m[1][3], m[2][3], m[3][3]);
}

float inverse(float m) {
  return 1.0 / m;
}

mat2 inverse(mat2 m) {
  return mat2(m[1][1], -m[0][1],
    -m[1][0], m[0][0]) / (m[0][0] * m[1][1] - m[0][1] * m[1][0]);
}

mat3 inverse(mat3 m) {
  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];
  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];
  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];

  float b01 = a22 * a11 - a12 * a21;
  float b11 = -a22 * a10 + a12 * a20;
  float b21 = a21 * a10 - a11 * a20;

  float det = a00 * b01 + a01 * b11 + a02 * b21;

  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),
    b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),
    b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;
}

mat4 inverse(mat4 m) {
  float
  a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
    a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
    a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
    a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],

    b00 = a00 * a11 - a01 * a10,
    b01 = a00 * a12 - a02 * a10,
    b02 = a00 * a13 - a03 * a10,
    b03 = a01 * a12 - a02 * a11,
    b04 = a01 * a13 - a03 * a11,
    b05 = a02 * a13 - a03 * a12,
    b06 = a20 * a31 - a21 * a30,
    b07 = a20 * a32 - a22 * a30,
    b08 = a20 * a33 - a23 * a30,
    b09 = a21 * a32 - a22 * a31,
    b10 = a21 * a33 - a23 * a31,
    b11 = a22 * a33 - a23 * a32,

    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  return mat4(
    a11 * b11 - a12 * b10 + a13 * b09,
    a02 * b10 - a01 * b11 - a03 * b09,
    a31 * b05 - a32 * b04 + a33 * b03,
    a22 * b04 - a21 * b05 - a23 * b03,
    a12 * b08 - a10 * b11 - a13 * b07,
    a00 * b11 - a02 * b08 + a03 * b07,
    a32 * b02 - a30 * b05 - a33 * b01,
    a20 * b05 - a22 * b02 + a23 * b01,
    a10 * b10 - a11 * b08 + a13 * b06,
    a01 * b08 - a00 * b10 - a03 * b06,
    a30 * b04 - a31 * b02 + a33 * b00,
    a21 * b02 - a20 * b04 - a23 * b00,
    a11 * b07 - a10 * b09 - a12 * b06,
    a00 * b09 - a01 * b07 + a02 * b06,
    a31 * b01 - a30 * b03 - a32 * b00,
    a20 * b03 - a21 * b01 + a22 * b00) / det;
}

float pow3(float x, float y) {
  return exp2(y * log2(x));
}

vec3 pow2(vec3 x, vec3 y) {
  return vec3(pow3(x.x, y.x), pow3(x.y, y.y), pow3(x.z, y.z));
}


void main(void) {
  if (!u_isLightingEnabled) {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
    v_texture_coords = a_texture_coords;
    return;
  }

  v_texture_coords = a_texture_coords;
  v_position = a_position;
  v_normal = a_normal;
  v_model = u_model;

  v_light1_pos = u_light1_pos;
  v_light1_intensities = u_light1_intensities;
  v_light1_attenuation = u_light1_attenuation;
  v_light1_ambient_coefficient = u_light1_ambient_coefficient;

  Light light1;
  light1.intensities = v_light1_intensities;
  light1.position = v_light1_pos;
  light1.attenuation = v_light1_attenuation;
  light1.ambientCoefficient = v_light1_ambient_coefficient;

  vec3 surfacePos = vec3(v_model * vec4(v_position, 1));

  mat3 normalMatrix = transpose(inverse(mat3(v_model)));
  vec3 normal = normalize(normalMatrix * v_normal);

  vec3 fragPosition = vec3(v_model * vec4(v_position, 1));

  vec3 surfaceToLight = light1.position - fragPosition;

  float brightness = dot(normal, surfaceToLight) / (length(surfaceToLight) * length(normal));
  if (brightness > 1.0) {
    brightness = 1.0;
  } else if (brightness < 0.0) {
    brightness = 0.0;
  }

  float distanceToLight = length(light1.position - surfacePos);

  v_diffuseCoefficient = max(0.0, dot(normal, surfaceToLight));
  v_attenuation = 1.0 / (1.0 + light1.attenuation * pow3(distanceToLight, 2.0));
  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
}
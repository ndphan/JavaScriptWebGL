
precision mediump float;

vec4 packDepthToRGBA(const float v) {
  const float PackUpscale = 256. / 255.;
  const vec3 PackFactors = vec3(256. * 256. * 256., 256. * 256., 256.);
  const float ShiftRight8 = 1. / 256.;

  vec4 r = vec4(fract(v * PackFactors), v);
  r.yzw -= r.xyz * ShiftRight8; // tidy overflow
  return r * PackUpscale;
}

void main(void) {
  gl_FragColor = packDepthToRGBA(gl_FragCoord.z);
}


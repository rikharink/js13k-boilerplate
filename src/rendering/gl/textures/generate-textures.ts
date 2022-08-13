import { RgbColor } from '../../../types';
import {
  GL_CLAMP_TO_EDGE,
  GL_DATA_UNSIGNED_BYTE,
  GL_LINEAR,
  GL_RGB,
  GL_TEXTURE_2D,
  GL_TEXTURE_MAG_FILTER,
  GL_TEXTURE_MIN_FILTER,
  GL_TEXTURE_WRAP_S,
  GL_TEXTURE_WRAP_T,
} from '../gl-constants';

export function generateSolidTexture(
  gl: WebGL2RenderingContext,
  color: RgbColor,
): WebGLTexture {
  return generateRampTexture(gl, [color]);
}

export function generateRampTexture(
  gl: WebGL2RenderingContext,
  colors: RgbColor[],
): WebGLTexture {
  const pixels: Uint8Array = new Uint8Array(colors.length * 3);
  for (let i = 0; i < colors.length; i++) {
    const pi = i * 3;
    pixels[pi + 0] = colors[i][0];
    pixels[pi + 1] = colors[i][1];
    pixels[pi + 2] = colors[i][2];
  }
  const texture = gl.createTexture()!;
  gl.bindTexture(GL_TEXTURE_2D, texture);
  gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
  gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
  gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
  gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

  gl.texImage2D(
    GL_TEXTURE_2D,
    0,
    GL_RGB,
    colors.length,
    1,
    0,
    GL_RGB,
    GL_DATA_UNSIGNED_BYTE,
    pixels,
  );
  return texture;
}

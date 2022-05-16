import {
  GL_COMPILE_STATUS,
  GL_FRAGMENT_SHADER,
  GL_LINK_STATUS,
  GL_VERTEX_SHADER,
} from './gl-constants';

export function initShaderProgram(
  ctx: WebGL2RenderingContext,
  vertexSource: string,
  fragSource: string,
): WebGLProgram | null {
  const vertexShader = loadShader(ctx, GL_VERTEX_SHADER, vertexSource);
  const fragmentShader = loadShader(ctx, GL_FRAGMENT_SHADER, fragSource);

  const shaderProgram = ctx.createProgram()!;
  ctx.attachShader(shaderProgram, vertexShader);
  ctx.attachShader(shaderProgram, fragmentShader);
  ctx.linkProgram(shaderProgram);
  if (
    process.env.NODE_ENV === 'DEBUG' &&
    !ctx.getProgramParameter(shaderProgram, GL_LINK_STATUS)
  ) {
    console.error(
      'Unable to initialize the shader program: ' +
        ctx.getProgramInfoLog(shaderProgram),
    );
    return null;
  }
  return shaderProgram;
}

function loadShader(ctx: WebGL2RenderingContext, type: number, source: string) {
  const shader = ctx.createShader(type)!;
  ctx.shaderSource(shader, source);
  ctx.compileShader(shader);
  if (
    process.env.NODE_ENV === 'DEBUG' &&
    !ctx.getShaderParameter(shader, GL_COMPILE_STATUS)
  ) {
    console.error(
      'An error occurred compiling the shaders: ' +
        ctx.getShaderInfoLog(shader),
    );
    ctx.deleteShader(shader);
  }
  return shader;
}

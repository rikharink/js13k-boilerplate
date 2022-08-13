import { GL_CURRENT_PROGRAM } from './gl-constants';

export class Shader {
  public constructor(program: WebGLProgram) {
    this.program = program;
  }

  program: WebGLProgram;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;

  public enable(gl: WebGL2RenderingContext) {
    if (gl.getParameter(GL_CURRENT_PROGRAM) !== this.program) {
      gl.useProgram(this.program);
    }
  }

  public has(attribute: string): boolean {
    return this[attribute] !== undefined;
  }
}

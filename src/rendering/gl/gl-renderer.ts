import settings, { defaultRendererSettings } from '../../settings';
import { RendererSettings } from '../renderer-settings';
import frag from './default.frag.glsl';
import vert from './default.vert.glsl';
import { initShaderProgram } from './gl-util';
import { Renderer } from '../renderer';
import { Canvas } from '../canvas';

export class WebGL2Renderer implements Renderer {
  private _ctx!: WebGL2RenderingContext;
  public canvas: Canvas;

  private get _canvas(): HTMLCanvasElement {
    return this.canvas.canvas;
  }

  constructor(canvas: Canvas, rendererSettings?: Partial<RendererSettings>) {
    settings.rendererSettings = {
      ...defaultRendererSettings,
      ...rendererSettings,
    };
    this.canvas = canvas;
    this.setupCanvas();
  }

  public setupCanvas() {
    this._ctx = this._canvas.getContext('webgl2', {
      antialias: settings.rendererSettings.antialias,
    })!;
    const [width, height] = settings.rendererSettings.resolution;
    this.setAntialias();
    this.setResolution(width, height);
    const program = initShaderProgram(this._ctx, vert, frag)!;
    this._ctx.useProgram(program.program);
  }

  public setResolution(width: number, height: number): void {
    this._canvas.width = width;
    this._canvas.height = height;
    this._ctx.viewport(0, 0, width, height);
  }

  public setAntialias(): void {
    if (settings.rendererSettings.antialias) {
      this._ctx.canvas.classList.remove('no-aa');
      this._ctx.canvas.classList.add('aa');
    } else {
      this._ctx.canvas.classList.remove('aa');
      this._ctx.canvas.classList.add('no-aa');
    }
  }

  public render() {
    const color = settings.rendererSettings.clearColor;
    this._ctx.clearColor(color[0], color[1], color[2], color[3]);
    this._ctx.clear(settings.rendererSettings.clearMask);
  }
}

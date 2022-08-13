import { Canvas } from './canvas';

export interface Renderer {
  canvas: Canvas;
  render(): void;
}

import { Resolution } from '../types';

interface CanvasSettings {
  id: string;
  resolution: Resolution;
}

export class Canvas {
  public canvas: HTMLCanvasElement;

  constructor({ id, resolution }: CanvasSettings) {
    this.canvas = document.createElement('canvas');
    this.canvas.id = id;
    this.canvas.width = resolution[0];
    this.canvas.height = resolution[1];
    document.body.appendChild(this.canvas);
  }
}

import settings from '../settings';
import { Milliseconds } from '../types';

export class Game {
  _running: boolean = false;
  _handle: number = 0;
  _then?: number;
  _t: number = 0;
  _accumulator: number = 0;

  constructor(private _canvas: HTMLCanvasElement) {
    window.addEventListener('focus', this.start.bind(this));
    window.addEventListener('blur', this.stop.bind(this));
  }

  loop(now: Milliseconds) {
    this._handle = requestAnimationFrame(this.loop.bind(this));
    if (this._then) {
      const ft = now - this._then;
      this._then = now;
      if (ft > 1000) {
        return;
      }

      this._accumulator += ft;

      while (this._accumulator >= settings.dt) {
        this._t += settings.dt;
        //DO FIXED STEP STUFF
        this._accumulator -= settings.dt;
      }

      const alpha = this._accumulator / settings.dt;
      //DO VARIABLE STEP STUFF
    }
  }

  public start() {
    this._running = true;
    this._handle = requestAnimationFrame(this.loop.bind(this));
  }

  public stop() {
    this._running = false;
    cancelAnimationFrame(this._handle);
  }

  public toggle() {
    this._running = !this._running;
    this._running ? this.start() : this.stop();
  }
}

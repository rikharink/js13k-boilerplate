import { stats } from '../debug/gui';
import { WebGL2Renderer } from '../rendering/gl-renderer';
import settings from '../settings';
import { Milliseconds } from '../types';
import { InputManager } from './input-manager';

export class Game {
  private _running = true;
  private _handle = 0;
  private _then?: number;
  private _t = 0;
  private _accumulator = 0;
  private _input: InputManager;

  constructor(public renderer: WebGL2Renderer) {}

  loop(now: Milliseconds) {
    if (process.env.NODE_ENV === 'development') {
      stats.begin();
    }
    this._handle = requestAnimationFrame(this.loop.bind(this));
    if (this._then) {
      const ft = now - this._then;
      if (ft > 1000) {
        this._then = now;
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
      this.renderer.render();
    }
    this._then = now;
    if (process.env.NODE_ENV === 'development') {
      stats.end();
    }
  }

  public start() {
    this._running = true;
    this._handle = requestAnimationFrame(this.loop.bind(this));
  }

  public stop() {
    this._running = false;
    this._then = undefined;
    cancelAnimationFrame(this._handle);
  }

  public toggle() {
    this._running = !this._running;
    this._running ? this.start() : this.stop();
  }
}

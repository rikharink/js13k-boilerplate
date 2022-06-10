import { Milliseconds, Bpm } from '../types';

interface TransportOptions {
  tempo: Bpm;
  lookAheadTime: Milliseconds;
  contextOptions?: AudioContextOptions;
}

export class Transport {
  private _lookAheadTime: Milliseconds;
  private _handler?: ReturnType<typeof setTimeout>;
  private _ctx: AudioContext;
  private _tempo: Bpm;

  constructor(options?: Partial<TransportOptions>) {
    this._lookAheadTime = options?.lookAheadTime ?? 100;
    this._ctx = new AudioContext(options?.contextOptions);
    this._tempo = options?.tempo ?? 100;
  }

  public start() {
    this._handler = setTimeout(this.schedule.bind(this), this._lookAheadTime);
  }

  public stop() {
    if (this._handler) {
      clearTimeout(this._handler);
    }
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this._tempo;
  }

  private schedule() {
    const time = this._ctx.currentTime;
  }
}

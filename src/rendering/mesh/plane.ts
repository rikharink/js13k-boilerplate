import { Mesh } from './mesh';

interface PlaneOptions {
  columns: number;
  rows: number;
}

export class Plane extends Mesh {
  private _columns: number;
  private _rows: number;

  constructor(options?: Partial<PlaneOptions>) {
    super();
    this._columns = options?.columns ?? 10;
    this._rows = options?.rows ?? 10;

    this.updateTriangleMap();
    this.recalculateNormals();
  }
}

import { Vector2 } from '../../math/vector2';
import { add, cross, normalize, subtract, Vector3 } from '../../math/vector3';

export class Mesh {
  public vertices: Vector3[] = [];
  public triangles: number[] = [];
  public normals: Vector3[] = [];
  public uvs: Vector2[] = [];
  private _vertexTriangleMap: Map<number, Array<number>> = new Map<
    number,
    Array<number>
  >();

  public addTriangles(...triangleIndices: number[]) {
    this.triangles.push(...triangleIndices);
    this.updateTriangleMap();
  }

  public recalculateNormals(): void {
    for (let i = 0; i < this.vertices.length; i++) {
      const triangles = this._vertexTriangleMap.get(i);
      if (triangles === undefined) {
        throw Error(`Vertex with index ${i} is not part of any triangle`);
      }
      const normal: Vector3 = [0, 0, 0];
      for (let ti of triangles) {
        const p1 = this.vertices[this.triangles[ti]];
        const p2 = this.vertices[this.triangles[ti + 1]];
        const p3 = this.vertices[this.triangles[ti + 2]];
        add(normal, normal, this._getFaceNormal(p1, p2, p3));
      }
      this.normals[i] = normalize(normal, normal);
    }
  }

  public updateTriangleMap(): void {
    this._vertexTriangleMap.clear();
    for (let i = 0; i < this.triangles.length; i++) {
      const vertex = this.triangles[i];
      const ti = i - (i % 3);
      this._vertexTriangleMap.get(vertex)?.push(ti) ??
        this._vertexTriangleMap.set(vertex, [ti]);
    }
  }

  private _getFaceNormal(p1: Vector3, p2: Vector3, p3: Vector3): Vector3 {
    const A = subtract([0, 0, 0], p2, p1);
    const B = subtract([0, 0, 0], p3, p1);
    return normalize([0, 0, 0], cross([0, 0, 0], A, B));
  }
}

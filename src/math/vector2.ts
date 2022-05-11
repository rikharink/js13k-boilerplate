// ADAPTED FROM https://github.com/piesku/goodluck

// ISC License

// Copyright 2019 Contributors to the Goodluck project.

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

import { nearlyEqual as ne } from './util';

export type Vector2 = [x: number, y: number];

export function nearlyEqual(a: Vector2, b: Vector2, epsilon?: number): boolean {
  return !!(ne(a[0], b[0], epsilon) && ne(a[1], b[1], epsilon));
}

export function copy(out: Vector2, a?: Vector2): Vector2 | undefined {
  if (!a) return;
  out[0] = a[0];
  out[1] = a[1];
  return out;
}

export function add(out: Vector2, a: Vector2, b: Vector2): Vector2 {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}

export function subtract(out: Vector2, a: Vector2, b: Vector2): Vector2 {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}

export function scale(out: Vector2, a: Vector2, b: number): Vector2 {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}

export function mul(out: Vector2, a: Vector2, b: Vector2): Vector2 {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}

export function negate(out: Vector2, a: Vector2): Vector2 {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}

export function normalize(out: Vector2, a: Vector2) {
  const x = a[0];
  const y = a[1];
  let len = x * x + y * y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}

export function dot(a: Vector2, b: Vector2): number {
  return a[0] * b[0] + a[1] * b[1];
}

export function distance(a: Vector2, b: Vector2) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

export function distance_squared(a: Vector2, b: Vector2) {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  return x * x + y * y;
}

export function distance_manhattan(a: Vector2, b: Vector2) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function abs(out: Vector2, a: Vector2): Vector2 {
  out[0] = Math.abs(a[0]);
  out[1] = Math.abs(a[1]);
  return out;
}

export function length(a: Vector2) {
  const x = a[0];
  const y = a[1];
  return Math.hypot(x * x, y * y);
}

export function lerp(out: Vector2, a: Vector2, b: Vector2, t: number) {
  const ax = a[0];
  const ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}

const _a: Vector2 = [0, 0];
const _b: Vector2 = [0, 0];
const _c: Vector2 = [0, 0];
const _d: Vector2 = [0, 0];
const _e: Vector2 = [0, 0];
export function bezier(
  out: Vector2,
  p0: Vector2,
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  t: number,
): void {
  lerp(_a, p0, p1, t);
  lerp(_b, p1, p2, t);
  lerp(_c, p2, p3, t);
  lerp(_d, _a, _b, t);
  lerp(_e, _b, _c, t);
  lerp(out, _d, _e, t);
}

export function perpendicular(
  out: Vector2,
  dxdy: Vector2,
  clockwise: boolean = true,
): Vector2 {
  out[0] = dxdy[1];
  out[1] = dxdy[0];
  clockwise ? (out[1] = -out[1]) : (out[0] = -out[0]);
  return normalize(out, out);
}

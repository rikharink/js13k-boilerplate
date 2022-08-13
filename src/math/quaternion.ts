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

import { DEGREE_TO_RADIAN, EPSILON } from './util';
import {
  cross,
  dot,
  length,
  Vector3,
  normalize as normalize_vector3,
} from './vector3';

export type Quaternion = [x: number, y: number, z: number, w: number];
export function set(
  out: Quaternion,
  x: number,
  y: number,
  z: number,
  w: number,
) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

export function copy(out: Quaternion, a: Quaternion) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

export function normalize(out: Quaternion, a: Quaternion) {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  const w = a[3];
  let len = x * x + y * y + z * z + w * w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}

export function multiply(out: Quaternion, a: Quaternion, b: Quaternion) {
  const ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  const bx = b[0],
    by = b[1],
    bz = b[2],
    bw = b[3];

  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}

export function conjugate(out: Quaternion, a: Quaternion) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}

/**
 * Compute a quaternion out of three Euler angles given in degrees. The order of rotation is YXZ.
 * @param out Quaternion to write to.
 * @param x Rotation about the X axis, in degrees.
 * @param y Rotation around the Y axis, in degress.
 * @param z Rotation around the Z axis, in degress.
 */
export function from_euler(out: Quaternion, x: number, y: number, z: number) {
  const sx = Math.sin((x / 2) * DEGREE_TO_RADIAN);
  const cx = Math.cos((x / 2) * DEGREE_TO_RADIAN);
  const sy = Math.sin((y / 2) * DEGREE_TO_RADIAN);
  const cy = Math.cos((y / 2) * DEGREE_TO_RADIAN);
  const sz = Math.sin((z / 2) * DEGREE_TO_RADIAN);
  const cz = Math.cos((z / 2) * DEGREE_TO_RADIAN);

  out[0] = sx * cy * cz + cx * sy * sz;
  out[1] = cx * sy * cz - sx * cy * sz;
  out[2] = cx * cy * sz - sx * sy * cz;
  out[3] = cx * cy * cz + sx * sy * sz;
  return out;
}

/**
 * Compute a quaternion from an axis and an angle of rotation around the axis.
 * @param out Quaternion to write to.
 * @param axis Axis of rotation.
 * @param angle Rotation in radians.
 */
export function from_axis(out: Quaternion, axis: Vector3, angle: number) {
  const half = angle / 2;
  out[0] = Math.sin(half) * axis[0];
  out[1] = Math.sin(half) * axis[1];
  out[2] = Math.sin(half) * axis[2];
  out[3] = Math.cos(half);
  return out;
}

export const rotation_to = (function () {
  const tmpvec3: Vector3 = [0, 0, 0];
  const xUnitVec3: Vector3 = [1, 0, 0];
  const yUnitVec3: Vector3 = [0, 1, 0];

  return function (out: Quaternion, a: Vector3, b: Vector3) {
    const d = dot(a, b);
    if (d < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (length(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
      normalize_vector3(tmpvec3, tmpvec3);
      from_axis(out, tmpvec3, Math.PI);
      return out;
    } else if (d > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + d;
      return normalize(out, out);
    }
  };
})();

export function lerp(out: Quaternion, a: Quaternion, b: Quaternion, t: number) {
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param out - the receiving quaternion
 * @param a - the first operand
 * @param b - the second operand
 * @param t - interpolation amount, in the range [0-1], between the two inputs
 */
export function slerp(
  out: Quaternion,
  a: Quaternion,
  b: Quaternion,
  t: number,
) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  const ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  let bx = b[0],
    by = b[1],
    bz = b[2],
    bw = b[3];

  let omega, cosom, sinom, scale0, scale1;

  // calc cosine
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  // adjust signs (if necessary)
  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  // calculate coefficients
  if (1.0 - cosom > EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  }
  // calculate final values
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

export function get_axis(out_axis: Vector3, q: Quaternion) {
  const rad = Math.acos(q[3]) * 2.0;
  const s = Math.sin(rad / 2.0);
  if (s > EPSILON) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }
  return rad;
}

export function identity(): Quaternion {
  return [0, 0, 0, 1];
}

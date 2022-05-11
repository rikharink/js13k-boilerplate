import { Random } from '../types';

export function xmur3(seed: string): () => number {
  for (var i = 0, h = 1779033703 ^ seed.length; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

export function mulberry32(a: number): Random {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getRandom(seed: string): Random {
  return mulberry32(xmur3(seed)());
}

export function getBoundRandom(rand: Random, min: number, max: number): Random {
  return function () {
    return rand() * (max - min) + min;
  };
}

export function getBoundRandomInt(
  rand: Random,
  min: number,
  max: number,
): Random {
  min = Math.ceil(min);
  max = Math.floor(max);
  return function () {
    return Math.floor(getBoundRandom(rand, min, max)());
  };
}

export function getBoundRandomIntInclusive(
  rand: Random,
  min: number,
  max: number,
) {
  return getBoundRandomInt(rand, min, max + 1);
}

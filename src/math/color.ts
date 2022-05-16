import { Percentage, RgbColor, HslColor, RgbaColor } from '../types';

export function lighten(color: RgbColor, percentage: Percentage): RgbColor {
  let hsl = rgbToHsl(color);
  hsl[2] += (percentage / 100) * 50;
  return hslToRgb(hsl);
}

export function darken(color: RgbColor, percentage: Percentage) {
  let hsl = rgbToHsl(color);
  hsl[2] -= (percentage / 100) * 50;
  return hslToRgb(hsl);
}

export function mergeRgb(rgb: RgbColor): number {
  let [r, g, b] = rgb;
  let res = r;
  res = (res << 8) + g;
  res = (res << 8) + b;
  return res;
}

export function splitRgb(rgb: number): RgbColor {
  let r = (rgb & 0x00ff0000) >> 16;
  let g = (rgb & 0x0000ff00) >> 8;
  let b = rgb & 0x000000ff;
  return [r, g, b];
}

export function normalizeRgb(rgb: RgbColor): RgbColor {
  return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
}

export function normalizeRgba(rgba: RgbaColor): RgbaColor {
  return [rgba[0] / 255, rgba[1] / 255, rgba[2] / 255, rgba[3]/ 255];
}

//FROM: https://css-tricks.com/converting-color-spaces-in-javascript/
export function hslToRgb(hsl: HslColor): RgbColor {
  let [h, s, l] = hsl;
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return [r, g, b];
}

//FROM: https://css-tricks.com/converting-color-spaces-in-javascript/
export function rgbToHsl(rgb: RgbColor): HslColor {
  let [r, g, b] = rgb;
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  // No difference
  if (delta == 0) h = 0;
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}

export function rgbaString(color: RgbColor, alpha: number): string {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

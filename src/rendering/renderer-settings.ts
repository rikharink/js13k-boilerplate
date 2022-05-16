import { NormalizedRgbaColor, Resolution } from '../types';

export interface RendererSettings {
  clearColor: NormalizedRgbaColor;
  clearMask: number;
  resolution: Resolution;
  supportHiDpi: boolean;
  resizeToScreen: boolean;
  antialias: boolean;
}

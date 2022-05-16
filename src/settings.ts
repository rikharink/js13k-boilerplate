import {
  GL_COLOR_BUFFER_BIT,
  GL_DEPTH_BUFFER_BIT,
} from './rendering/gl-constants';
import { RendererSettings } from './rendering/renderer-settings';

export const defaultRendererSettings: RendererSettings = {
  clearColor: [1, 1, 1, 1],
  clearMask: GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT,
  supportHiDpi: false,
  resizeToScreen: false,
  resolution: [1920, 1080],
  antialias: true,
};

let settings = {
  dt: 10,
  rendererSettings: defaultRendererSettings,
};

export default settings;

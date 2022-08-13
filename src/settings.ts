import { DebugSettings } from './debug/gui';
import {
  GL_COLOR_BUFFER_BIT,
  GL_DEPTH_BUFFER_BIT,
} from './rendering/gl/gl-constants';
import { RendererSettings } from './rendering/renderer-settings';

export const defaultRendererSettings: RendererSettings = {
  clearColor: [1, 1, 1, 1],
  clearMask: GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT,
  resolution: [1920, 1080],
  antialias: true,
};

export const defaultDebugSettings: DebugSettings = {
  showSpector: false,
  showStats: false,
  forceMonetization: false,
};

const settings = {
  dt: 10,
  rendererSettings: defaultRendererSettings,
  debugSettings: defaultDebugSettings,
};

export default settings;

import './debug/gui';
import { showDebugGUI } from './debug/gui';
import { Game } from './game/game';
import { Canvas } from './rendering/canvas';
import { WebGL2Renderer } from './rendering/gl/gl-renderer';
import settings from './settings';
import state from './state';

const canvas = new Canvas({
  id: 'g',
  resolution: settings.rendererSettings.resolution,
});
const renderer = new WebGL2Renderer(canvas);
state.game = new Game(renderer);
state.game.start();

if (process.env.NODE_ENV === 'development') {
  showDebugGUI();
}

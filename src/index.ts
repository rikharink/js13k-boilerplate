import './debug/gui';
import { showDebugGUI } from './debug/gui';
import { Game } from './game/game';
import { WebGL2Renderer } from './rendering/gl-renderer';
import { injectStyle } from './rendering/style';
import state from './state';

injectStyle();
const renderer = new WebGL2Renderer({});
document.body.appendChild(renderer.canvas);
state.game = new Game(renderer);
state.game.start();

if (process.env.NODE_ENV === 'development') {
  showDebugGUI();
}

import './debug/gui';
import { showDebugGUI } from './debug/gui';
import { Game } from './game/game';
import { injectCanvas } from './rendering/canvas';
import { injectStyle } from './rendering/style';

injectStyle();
const canvas = injectCanvas();
const game = new Game(canvas);
game.start();
canvas.onclick = () => game.toggle();
if (process.env.DEBUG) {
  showDebugGUI();
}

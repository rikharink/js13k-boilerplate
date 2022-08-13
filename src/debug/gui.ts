import { TAU } from '../math/util';
import settings from '../settings';
import state from '../state';

export interface DebugSettings {
  showSpector: boolean;
  showStats: boolean;
  forceMonetization: boolean;
}

async function showDebugGUI() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const controls = new lil.GUI({ width: 375 });
  controls.close();
  if (!controls.addFolder) {
    return;
  }
  const gameControls = controls.addFolder('game');
  gameControls.add(settings, 'dt', 10, 100, 1);

  const renderingControls = controls.addFolder('rendering');
  renderingControls.addColor(settings.rendererSettings, 'clearColor');

  const debugControls = controls.addFolder('debug menus');

  //Spector.JS
  const spector = debugControls.add(
    settings.debugSettings,
    'showSpector',
    settings.debugSettings.showSpector,
  );
  spector.onChange(function (v: boolean) {
    showSpectorGUI(v);
  });
  createSpectorGUI();
  setTimeout(() => showSpectorGUI(settings.debugSettings.showSpector), 100);

  //Stats.js
  const stats = debugControls.add(
    settings.debugSettings,
    'showStats',
    settings.debugSettings.showStats,
  );
  stats.onChange(function (v: boolean) {
    showStatsGUI(v);
  });
  createStatsGUI();
  showStatsGUI(settings.debugSettings.showStats);

  const forceMonetization = debugControls.add(
    settings.debugSettings,
    'forceMonetization',
    settings.debugSettings.forceMonetization,
  );

  forceMonetization.onChange(function (v: boolean) {
    state.game!.monetized = v;
    if (v) {
      console.log('Monetization forced on');
    } else {
      console.log('Monetization forced off');
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-var
  var stats = new Stats();
  // eslint-disable-next-line no-var
  var spector: SPECTOR.Spector;
}

function showStatsGUI(isVisible: boolean) {
  stats.dom.style.display = isVisible ? 'block' : 'none';
}

function showSpectorGUI(isVisible: boolean) {
  const ele = document.querySelector('.captureMenuComponent')!.parentElement!;
  ele.style.display = isVisible ? 'block' : 'none';
}

function createStatsGUI() {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
}

function createSpectorGUI() {
  spector = new SPECTOR.Spector();
  spector.spyCanvas(state.game!.renderer.canvas.canvas);
  spector.displayUI();
}

export { stats, showDebugGUI };

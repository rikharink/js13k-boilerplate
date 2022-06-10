import settings from '../settings';
import state from '../state';

let debugMenus = {
  showSpector: false,
  showStats: false,
};

async function showDebugGUI() {
  //@ts-ignore
  const controls = new lil.GUI();
  let gameControls = controls.addFolder('game');
  gameControls.add(settings, 'dt', 10, 100, 1);

  let renderingControls = controls.addFolder('rendering');
  const aac = renderingControls.add(
    settings.rendererSettings,
    'antialias',
    true,
  );
  aac.onChange(function () {
    state.game!.renderer.setupCanvas();
  });
  renderingControls.add(
    settings.rendererSettings,
    'supportHiDpi',
    settings.rendererSettings.supportHiDpi,
  );

  renderingControls.add(
    settings.rendererSettings,
    'resizeToScreen',
    settings.rendererSettings.resizeToScreen,
  );
  renderingControls.addColor(settings.rendererSettings, 'clearColor');

  let debugControls = controls.addFolder('debug menus');

  //Spector.JS
  let spector = debugControls.add(
    debugMenus,
    'showSpector',
    debugMenus.showSpector,
  );
  spector.onChange(function (v: boolean) {
    showSpectorGUI(v);
  });
  createSpectorGUI();
  setTimeout(() => showSpectorGUI(debugMenus.showSpector), 100);

  //Stats.js
  let stats = debugControls.add(debugMenus, 'showStats', debugMenus.showStats);
  stats.onChange(function (v: boolean) {
    showStatsGUI(v);
  });
  createStatsGUI();
  showStatsGUI(debugMenus.showStats);
}

if (process.env.NODE_ENV === 'development') {
  var stats = new Stats();
  var spector: SPECTOR.Spector;
}

function showStatsGUI(isVisible: boolean) {
  stats.dom.style.display = isVisible ? 'block' : 'none';
}

function showSpectorGUI(isVisible: boolean) {
  let ele = document.querySelector('.captureMenuComponent')!.parentElement!;
  ele.style.display = isVisible ? 'block' : 'none';
}

function createStatsGUI() {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
}

function createSpectorGUI() {
  spector = new SPECTOR.Spector();
  spector.spyCanvas(state.game!.renderer.canvas);
  spector.displayUI();
  let w = window as any;
  w.spector = spector;
}

export { stats, showDebugGUI };

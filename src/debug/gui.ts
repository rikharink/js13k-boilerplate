import settings from '../settings';
import state from '../state';

let debugMenus = {
  showSpector: true,
  showStats: true,
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
  renderingControls.add(settings.rendererSettings, 'supportHiDpi', false);
  renderingControls.add(settings.rendererSettings, 'resizeToScreen', false);
  renderingControls.addColor(settings.rendererSettings, 'clearColor');

  let debugControls = controls.addFolder('debug menus');
  let spector = debugControls.add(debugMenus, 'showSpector', true);
  spector.onChange(function (v: boolean) {
    showSpectorGUI(v);
  });
  let stats = debugControls.add(debugMenus, 'showStats', true);
  stats.onChange(function (v: boolean) {
    showStatsGUI(v);
  });
  createSpectorGUI();
  createStatsGUI();
}

if (process.env.NODE_ENV === 'development') {
  var stats = new Stats();
}

function showStatsGUI(isVisible: boolean) {
  let ele = document.querySelector('div canvas')! as HTMLElement;
  ele.style.display = isVisible ? 'block' : 'none';
}

function showSpectorGUI(isVisible: boolean) {
  let ele = document.getElementsByClassName('captureMenuComponent')[0]
    .parentElement!;
  ele.style.display = isVisible ? 'block' : 'none';
}

function createStatsGUI() {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
}

function createSpectorGUI() {
  //@ts-ignore
  let spector = new SPECTOR.Spector();
  spector.displayUI();
}

export { stats, showDebugGUI };

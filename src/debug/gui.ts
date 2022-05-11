import settings from '../settings';

export async function showDebugGUI() {
  const controls = new window.dat.GUI();
  let settingsControls = controls.addFolder('settings');
  settingsControls.open();
  settingsControls.add(settings, 'dt', 10, 100, 1);
}

import settings from '../settings';

export async function showDebugGUI() {
  const controls = new window.dat.GUI();
  let stateControls = controls.addFolder('settings');
  stateControls.open();
  for (let key of Object.keys(settings)) {
    stateControls.add(settings, key);
  }
}

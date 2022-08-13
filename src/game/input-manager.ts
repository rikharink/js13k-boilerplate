export class InputManager {
  private _previousKeyState: Set<string> = new Set<string>();
  private _currentKeyState: Set<string> = new Set<string>();
  private _previousPointerState: Set<number> = new Set<number>();
  private _currentPointerState: Set<number> = new Set<number>();

  public constructor(element: HTMLElement) {
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    document.addEventListener('keyup', this._onKeyUp.bind(this));
    element.addEventListener('pointerdown', this._onPointerDown.bind(this));
    element.addEventListener('pointerup', this._onPointerUp.bind(this));
    element.addEventListener('contextmenu', (ev) => ev.preventDefault());
  }

  private _onKeyDown(ev: KeyboardEvent) {
    if (this._currentKeyState.has(ev.key)) {
      return;
    }
    this._previousKeyState.delete(ev.key);
    this._currentKeyState.add(ev.key);
  }

  private _onKeyUp(ev: KeyboardEvent) {
    if (!this._currentKeyState.has(ev.key)) {
      return;
    }
    this._previousKeyState.add(ev.key);
    this._currentKeyState.delete(ev.key);
  }

  private _onPointerDown(ev: PointerEvent) {
    const button = ev.button ?? 0;
    if (this._currentPointerState.has(button)) {
      return;
    }
    this._currentPointerState.add(button);
    this._previousPointerState.delete(button);
  }

  private _onPointerUp(ev: PointerEvent) {
    const button = ev.button ?? 0;
    if (!this._currentPointerState.has(button)) {
      return;
    }
    this._currentPointerState.delete(button);
    this._previousPointerState.add(button);
  }

  public hasKeyDown(key: string): boolean {
    return this._currentKeyState.has(key);
  }

  public hasKeyUp(key: string): boolean {
    return this._previousKeyState.has(key) && !this._currentKeyState.has(key);
  }

  public hasPointerDown(button: number = 0): boolean {
    return this._currentPointerState.has(button);
  }

  public hasPointerUp(button: number = 0): boolean {
    return (
      this._previousPointerState.has(button) &&
      !this._currentPointerState.has(button)
    );
  }

  public tick() {
    this._previousKeyState.clear();
    this._previousPointerState.clear();
  }
}

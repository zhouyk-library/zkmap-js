export default interface Layer {
  enable(): void;
  disable(): void;
  render(): void;
  getImage(): HTMLCanvasElement;
}
export default interface Source {
  clear(): void;
  refresh(): void;
  getData(z: number, x0: number, x1: number, y0: number, y1: number): any;
}
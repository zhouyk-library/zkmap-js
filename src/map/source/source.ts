export default interface Source {
  clear(): void;
  refresh(): void;
  getData(z: number, x: number, y: number, url: string): any;
}
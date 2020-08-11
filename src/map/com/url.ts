export default class URL {
  private _url: string;
  private _scheme: string;
  constructor(url: string, scheme: string) {
    this._url = url
    this._scheme = scheme

    // this._scheme = 'xyz'

    // this._url ='http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

    // this._url ='http://localhost:39999/map/rizhao/google/{z}/{x}/{y}.jpeg'

    // this._url ='http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'

    // this._url ='http://rt1.map.gtimg.com/realtimerender?z={z}&x={x}&y=${y}&type=vector&style=0&tms=true'
    // this._scheme = 'tms'

    // this._url ='https://tile.openstreetmap.org/{z}/{x}/{y}.png'

    // this._url ='http://192.168.1.149:39999/map/rizhao/osm/{z}/{x}/{y}.png'

    // this._url ='http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8'
  }
  getUrl(z: number, x: number, y: number): string {
    return this._url.slice().replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(this._scheme === 'tms' ? (Math.pow(2, z) - y - 1) : y))
  }
}
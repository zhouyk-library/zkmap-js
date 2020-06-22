export default class TitleSource {
  private _imageCatch = {}
  constructor() { }
  getTitle(z: number, x: number, y: number, callback: (err?: Error, image?: ImageBitmap) => void) {
    const key = `${z}-${x}-${y}`
    if (this._imageCatch[key]) {
      this.createdImage(this._imageCatch[key], callback)
    } else {

      const request = this.createdRequest(z, x, y)

      const requestTime = Date.now();
      window.fetch(request).then(response => {
        if (response.ok) {
          const cacheableResponse = response.clone();
          response.arrayBuffer().then(result => {
            if (cacheableResponse && requestTime) {
              this._imageCatch[key] = result
              this.createdImage(result, callback)
            }
          })
        } else {
          return callback(new Error(request.url));
        }
      }).catch(error => {
        if (error.code === 20) {
          return;
        }
        callback(new Error(error.message));
      });
    }
  }
  createdImage(data: ArrayBuffer, callback: (err?: Error, image?: ImageBitmap) => void) {
    const blob: Blob = new window.Blob([new Uint8Array(data)], { type: 'image/png' });
    window.createImageBitmap(blob).then((imgBitmap) => {
      callback(null, imgBitmap);
    }).catch((e) => {
      callback(new Error(`Could not load image because of ${e.message}. Please make sure to use a supported image type such as PNG or JPEG. Note that SVGs are not supported.`));
    });
  }
  createdRequest(z: number, x: number, y: number): Request {
    var myHeaders = new Headers();
    myHeaders.append("accept", "image/webp,*/*");
    myHeaders.append("Referer", "http://localhost:10248/");
    myHeaders.append("origin", "http://localhost:10248");
    myHeaders.append("accept-language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");
    myHeaders.append('Access-Control-Allow-Origin', '*',);
    myHeaders.append("accept-encoding", "gzip, deflate, br");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-sitee", "cross-site");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("authority", "tile.openstreetmap.org");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.45 Safari/537.36 Edg/84.0.522.20");

    const url = `http://localhost:9999/map/rizhao/google/${z}/${x}/${y}.jpeg`
    return new window.Request(url, {
      method: 'GET',
      mode: 'cors',
      // headers: myHeaders,
      signal: new window.AbortController().signal
    });
  }
}
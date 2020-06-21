export function Ajax(z: number, x: number, y: number, callback?: Function) {

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
  const request = new window.Request(url, {
    method: 'GET',
    mode: 'cors',
    signal: new window.AbortController().signal
  });

  fetch(url, request).then(res => {
    return res.blob();
  }).then(blob => {
    const img: HTMLImageElement = new window.Image();
    const URL = window.URL;
    img.onload = () => {
      callback && callback(img);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => callback(new Error('Could not load image. Please make sure to use a supported image type such as PNG or JPEG. Note that SVGs are not supported.'));
    img.src = URL.createObjectURL(blob)
    // callback && callback(window.URL.createObjectURL(blob))
  })
    .catch(error => console.log(error));
}
export function loadAjax(z: number, x: number, y: number): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      Ajax(z, x, y, resolve)
    } catch (error) {
      reject(error)
    }
  })
}
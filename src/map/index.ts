import Map from './main/map'

export default {
  map: new Map({
    container: "app",
    type: '2d',
    source: [
      {
        id: 'sourceId',
        type: 'raster',
        url: 'http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
        scheme: 'xyz'
      }
    ],
    layer: [
      {
        id: 'layerId',
        type: 'raster',
        source: 'sourceId',
      },
      {
        id: 'rasterdebuggerId',
        type: 'rasterdebugger',
        source: 'debugger'
      }
    ]
  })
};
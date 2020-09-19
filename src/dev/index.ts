import zkmap from '../map/index';

new zkmap.Map({
  container: "app",
  type: '2d',
  source: [
    {
      id: 'sourceId',
      type: 'raster',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      // url: 'http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
      // url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      // url: 'http://www.google.cn/maps/vt?lyrs=r@189&gl=cn&x={x}&y={y}&z={z}',
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
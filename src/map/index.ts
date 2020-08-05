import Map from './main/map'

export default {
  map:new Map({
    container:"app",
    type:'2d',
    source:[
      {
        id:'sourceId',
        type:'raster',
        url:'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
        scheme:'xyz'
      }
    ],
    layer:[
      {
        id:'layerId',
        type:'raster',
        source:'sourceId',
      },
      {
        id:'rasterdebuggerId',
        type:'rasterdebugger',
        source:'debugger'
      }
    ]
  })
};
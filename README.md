# zkmap-js


小而美的地图框架


> 安装
```
npm install

```

> 开发环境运行
```
npm run dev

```

> 生产构建
```
npm run build

```

#### 基础用法


###### 引入
> npm
```
import zkmap from 'zk-map';

```


> script
```
<!-- 未发布,自行打包引入 -->
<script type="text/javascript" src="js/zkmap.js"></script>

```


###### 示例代码

```
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


```
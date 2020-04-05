
<h1 class="title">
AbandonList
</h1>
<style>
@font-face {
  font-family: ADAM;
  src: url('./assets/fonts/ADAM.ttf')
}
.title {
  font-family: ADAM;
}
</style>

[![Travis](https://img.shields.io/badge/language-JavaScript-yellow.svg)]()

AbandonList是一款运行在IOS端的日程待办管理App。

> 之所以这样说是因为它的数据源直接取自手机的日历数据。无需导入也无需备份，下载App后日历里的日程也可以直接显示,非常的方便

![首页图片](./readMeImage/main_min.png)
![首页图片](./readMeImage/main_max.png)
![首页图片](./readMeImage/add.png)
![首页图片](./readMeImage/daily.png)
![首页图片](./readMeImage/itemView.png)
![首页图片](./readMeImage/overView.png)




### 配置运行环境

* 安装依赖项

使用yarn

```
yarn
```

或使用npm

```
npm install
```

* 某些包需要手动链接(例如```react-native-calendar-events```)

```
react-native link
```

* 安装pod

```
cd ios && pod install && cd ..
```

### Extra

如果字体无法显示，参见[react-native添加字体说明](./AddFont.md)


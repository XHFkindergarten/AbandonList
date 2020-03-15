### 配置运行环境

* 安装依赖项

```
> 使用yarn
yarn
> 或使用npm
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

如果字体无法显示，参见react-native添加字体说明


### react-native添加自定义字体

#### 在```react-native```添加自定义字体

### 1. 引入字体

在项目根目录创建```assets/fonts```文件夹，将字体文件放入

![](./WechatIMG4.png)

### 2. 在**XCode**中配置字体

* 首先将```fonts```文件夹拖动到XCode的项目文件中，会出现一个提示框，记得选中第二项，我忘了叫什么。最终创建出来的文件夹是蓝色的(代表只是建立链接

![](WechatIMG5.png)

### 3. 修改```info.plist```文件

可以直接在XCode中修改，也可以在项目```ios/[projectName]/info.plist```中修改

![](./WechatIMG6.png)

![](./WechatIMG7.png)

### 4. 调用字体

直接在样式中通过```fontFamily```来使用字体。

但是在IOS端使用的是字体的英文名。可以直接打开字体文件来查看

![](./WechatIMG8.png)

例如这里的字体调用就是

```JavaScript
font: {
	fontFamily: 'ADAM.CG PRO'
}
```


### *. 不确定是否必要的工作

#### 在根目录添加文件```react-native.config.js```

```
// react-native.config.js
module.exports = {
  assets: [
    './assets/fonts/'
  ]
}
```

#### 创建链接

```
react-native link
```
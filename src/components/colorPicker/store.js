import { observable, action } from 'mobx'
import { getStorage, setStorage } from 'src/utils'


const colorListKey = '@color_list_k1y'

class Store {
  constructor() {
    this.initialColorList()
  }
  // 曾经创建过的颜色，限制只存储8种颜色的HEX格式
  @observable
  colorList = []
  @action
  updateColorList = value => this.colorList = value

  // 初始化颜色列表
  initialColorList = async () => {
    const listStr = await getStorage(colorListKey)
    let list = []
    if (listStr) {
      list = JSON.parse(listStr)
    }
    this.updateColorList(list)
  }
  // 存储一种颜色
  saveColor = color => {
    const newColorList = [
      color,
      ...this.colorList.slice()
    ]
    if (newColorList.length > 8) {
      newColorList.pop()
    }
    this.updateColorList(newColorList)
    setStorage(colorListKey, JSON.stringify(newColorList))
  }
}


export default new Store()
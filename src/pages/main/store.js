import { observable, action } from 'mobx'

class Store {
  // 是否在滑动卡片
  // @observable
  isScrollCard = false
  // @action
  updateIsScroll = value => {
    this.isScrollCard = value
  }

  // 左滑右滑卡片时禁止scroll
  // @observable
  // preventScroll = false
  // @action
  // updatePreventScroll = value => this.preventScroll = value
}

export default new Store()
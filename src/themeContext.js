import { createContext } from 'react'


/**
 * 色彩主题上下文
 */


export const theme = {
  // 暗色[默认]
  darkTheme :{
    themeColor: '#0068C4',
    name: '@global_dark_theme',
    mainColor: '#191919',
    subColor: '#2F2F2F',
    mainText: '#DBDBDB',
    subText: '#616161',
    gapLine: '#999',
    pureText: '#FFF'
  },
  // 亮色
  lightTheme: {
    name: '@global_light_theme',
    themeColor: '#0068C4',
    mainColor: '#FFF',
    subColor: '#F4F4F8',
    mainText: '#000',
    subText: '#444'
  }
}

const ThemeContext = createContext(theme.darkTheme)

export default ThemeContext
import { createContext } from 'react'


/**
 * 色彩主题上下文
 */


export const theme = {
  // 暗色[默认]
  darkTheme :{
    themeColor: '#0068C4',
    name: '@global_dark_theme',
    mainColor: '#111',
    subColor: '#252525',
    mainText: '#DBDBDB',
    subText: '#616161',
    gapLine: '#999',
    pureText: '#FFF'
  },
  // 亮色
  lightTheme: {
    name: '@global_light_theme',
    mainColor: '#FFF',
    subColor: '#DBDBDB',
    mainText: '#DBDBDB',
    subText: '#444'
  }
}

const ThemeContext = createContext(theme.darkTheme)

export default ThemeContext
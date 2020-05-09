import { createContext } from 'react'

/**
 * 色彩主题上下文
 */


export const theme = {
  // 暗色[默认]
  darkTheme :{
    themeColor: '#0068C4', // 主题色
    baseThemeText: '#DBDBDB', // 覆盖在主题色上的文字颜色，基于主题色的明暗来决定
    name: '@global_dark_theme',
    mainColor: '#191919', // 主色调，偏纯黑
    subColor: '#232323', // 副色， 偏灰色
    mainText: '#DBDBDB', // 主要的文字颜色，偏亮
    subText: '#616161', // 副文字颜色，偏暗
    gapLine: '#999', // 间隔线颜色
    pureText: '#FFF' // 突出型文字颜色，纯白色
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
/*
 * @Descripttion : 主题色设置模块
 * @Author       : lizhaokang
 * @Date         : 2020-05-09 01:03:41
 */
import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import themeContext from 'src/themeContext'


export default function ThemeColor({ onChangeTheme }) {

  const theme = useContext(themeContext)

  return (
    <View style={ {
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 40
    } }
    >
      <TouchableOpacity onPress={ onChangeTheme }>
        <View style={ styles.container }>
          <View style={ [ styles.titleWrapper, {
            backgroundColor: theme.themeColor
          } ] }
          >

            <Text style={ styles.title }>主题色</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={ {
        alignItems: 'center'
      } }
      >
        <Text style={ [ styles.subTitle , {
          marginTop: 20
        } ] }
        >选择更适合你的主题色</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // marginTop: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleWrapper: {
    borderRadius: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 12
  },
  title: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 20
  },
  subTitle: {
    width: 300,
    lineHeight: 20,
    textAlign: 'center',
    color: '#8a8a8a',
    fontSize: 14
  }
})
/*
 * @Descripttion : 选择壁纸
 * @Author       : lizhaokang
 * @Date         : 2020-05-09 16:21:20
 */
import React, { useContext } from 'react';
import { View, TouchableOpacity, Dimensions, ImageBackground, StyleSheet, Text } from 'react-native';
import themeContext from 'src/themeContext'
import { wallpaper1, wallpaper2, wallpaper3 } from 'src/assets/image'
import { observer } from 'mobx-react'
import finishStore from './store'

const { width:screenWidth } = Dimensions.get('window')

const itemWidth = Math.round((screenWidth - 120) / 3)

const wallpaper = [
  wallpaper1,
  wallpaper2,
  wallpaper3
]

function Wallpaper() {

  const theme = useContext(themeContext)

  const wallpaperIndex = finishStore.wallpaperIndex

  const handleSelect = index => {
    finishStore.changeWallPaper(index + 1)
  }

  return (
    <View style={ {
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 40
    } }
    >
      <TouchableOpacity>
        <View style={ styles.container }>

          <Text style={ styles.title }>纹理</Text>
        </View>
      </TouchableOpacity>
      <View style={ {
        alignItems: 'center'
      } }
      >
        <Text style={ [ styles.subTitle , { marginTop: 20 } ] }>一个视觉上的实验性功能</Text>
      </View>
      <View style={ styles.blockRow }>
        {
          wallpaper.map((item, index) => (
            <TouchableOpacity key={ index }
              onPress={ () => {
                handleSelect(index)
              } }
            >
              <ImageBackground
                imageStyle={ { opacity: 0.3, transform: [ { scale: 2 } ] } }
                source={ item }
                style={ [ styles.blockItem, {
                  overflow: 'hidden',
                  backgroundColor: theme.themeColor
                }, index + 1 === parseInt(wallpaperIndex) && styles.selected ] }
              />
            </TouchableOpacity>
          ))
        }
      </View>
    </View>
  )
}

export default observer(Wallpaper)

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
  },
  blockRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20
  },
  blockItem: {
    height: itemWidth,
    width: itemWidth,
    borderRadius: 6
  },
  selected: {
    borderWidth: 2,
    borderColor: '#FFF'
  }
})
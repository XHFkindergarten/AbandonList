/*
 * @Descripttion : 颜色选择器，基于react-native-color修改
 * @Author       : lizhaokang
 * @Date         : 2020-05-05 21:48:33
 */
import React, { useCallback, useState, useContext, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native'
import { isNewIPhone } from 'src/utils'
import tinycolor from 'tinycolor2'
import PropTypes from 'prop-types'
import { down, correct } from 'src/assets/image'
import themeContext from 'src/themeContext'
import HueSlider from './sliders/HueSlider';
import SaturationSlider from './sliders/SaturationSlider';
import LightnessSlider from './sliders/LightnessSlider';
import { ScrollView } from 'react-native-gesture-handler';
import { observer } from 'mobx-react';
import store from './store'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const blockSize = (screenWidth - 70) / 4

const btnWidth = (screenWidth - 60) / 4


const modes = {
  hex: {
    getString: color => tinycolor(color).toHexString(),
    label: 'HEX'
  },
  hsl: {
    getString: color => tinycolor(color).toHslString(),
    label: 'HSL'
  },
  hsv: {
    getString: color => tinycolor(color).toHsvString(),
    label: 'HSV'
  },
  rgb: {
    getString: color => tinycolor(color).toRgbString(),
    label: 'RGB'
  }
};

const entireColorReg = /#[0-9a-zA-Z]{6}/



function ColorPicker({ visible, color, onOk, onCancel }) {

  const theme = useContext(themeContext)

  // 初始化usedcolor
  const handleShow = () => {
    updateInputColor(initialColor)
    store.initialColorList()
  }

  // 重置颜色
  const resetColor = () => {
    if (!color) {
      updateInputColor(theme.themeColor)
    }
  }

  const initialColor = color || theme.themeColor

  useEffect(() => {
    updateInputColor(initialColor)
  }, [ initialColor ])

  const [ inputColor, setInputColor ] = useState(initialColor)

  // 颜色用HSL格式来存储
  const [ hslColor, setColor ] = useState(tinycolor(initialColor).toHsl())

  // 选择查看的模式
  const [ mode, setMode ] = useState('hex')

  // 颜色是否是暗色
  const isDark = tinycolor(hslColor).isDark()


  // 更新色值方法
  const updateHue = h => {
    updateHslColor({ ...hslColor, h })
  };
  const updateSaturation = s => updateHslColor({ ...hslColor, s });
  const updateLightness = l => updateHslColor({ ...hslColor, l });

  const updateInputColor = value => {
    setInputColor(tinycolor(value).toHexString())
    setColor(tinycolor(value).toHsl())
  }
  const updateHslColor = value => {
    setInputColor(tinycolor(value).toHexString())
    setColor(tinycolor(value).toHsl())
  }

  const handleOk = () => {
    store.saveColor(renderColor)
    onOk(renderColor)
  }

  const handleCancel = () => {
    onCancel()
    setColor(tinycolor(theme.themeColor).toHsl())
  }

  const ModeButton = ({ mode : m }) => {
    const handleClick = useCallback(() => {
      if (!entireColorReg.test(inputColor)) {
        updateHslColor(hslColor)
      }
      setMode(m)
    }, [ m ])
    return (
      <TouchableOpacity onPress={ handleClick }
        style={ [ styles.btn, { backgroundColor: m === mode ? theme.themeColor : 'transparent' } ] }
      >
        <Text style={ styles.btnText }>{ modes[m].label }</Text>
      </TouchableOpacity>
    )
  }

  const showColorText = useMemo(() => {
    return modes[mode].getString(inputColor)
  }, [ mode, inputColor ])

  const textInputRef = useRef(null)

  const handleChangeText = value => {
    setInputColor(value)
    if (entireColorReg.test(value)) {
      setColor(tinycolor(value).toHsl())
    }
  }

  const handleBlur = value => {
    if (!entireColorReg.test(value)) {
      updateHslColor(hslColor)
    }
  }

  const renderColor = tinycolor(hslColor).toHexString()

  const handleOnScroll = event => {
    const dy = event.nativeEvent.contentOffset.y
    if (dy < -80) {
      handleCancel()
    }
  }

  // 曾经创造过的颜色
  const usedColorList = store.colorList.slice()
  const matrixColorList = useMemo(() => {
    const temp = []
    while (usedColorList.length !== 0) {
      temp.push(usedColorList.splice(0, 4))
    }
    return temp
  }, [ usedColorList ])


  const RenderBlock = ({ color, index }) => {
    const handleClickItem = () => {
      updateInputColor(color)
    }
    return (
      <TouchableOpacity onPress={ handleClickItem }>
        <View
          style={ [ styles.colorBlock, {
            marginRight: index === 3 ? 0 : 10,
            backgroundColor: color
          } ] }
        />
      </TouchableOpacity>
    )
  }

  return (
    <Modal
      animationType="slide"
      onDismiss={ resetColor }
      onShow={ handleShow }
      transparent
      visible={ visible }
    >
      <View style={ styles.wrapper }>
        <View style={ styles.betweenRow }>
          <TouchableOpacity
            onPress={ handleCancel }
            style={ {
              paddingVertical: 20,
              paddingRight: 20
            } }
          >
            <Image source={ down }
              style={ styles.handleIcon }
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={ handleOk }
            style={ {
              paddingVertical: 20,
              paddingLeft: 20
            } }
          >
            <Image source={ correct }
              style={ styles.handleIcon }
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          bounces={ false }
          keyboardDismissMode="interactive"
          onScroll={ handleOnScroll }
          scrollEventThrottle={ 1 }
          style={ styles.container }
        >

          <View style={ [ styles.card, {
            backgroundColor: renderColor,
            marginBottom: 20
          } ] }
          >
            <TextInput
              caretHidden
              defaultValue={ mode !== 'hex' ? showColorText : inputColor }
              editable={ mode === 'hex' }
              keyboardAppearance="dark"
              maxLength={ 7 }
              onBlur={ handleBlur }
              onChangeText={ handleChangeText }
              ref={ textInputRef }
              returnKeyType="done"
              style={ [
                styles.cardText,
                { color: isDark ? '#FFF' : '#000' }
              ] }
              value={ mode !== 'hex' ? showColorText : inputColor }
            />
          </View>
          <View style={ styles.row }>
            { Object.keys(modes).map(item => (
              <ModeButton key={ item }
                mode={ item }
              />
            )) }
          </View>
          <View style={ styles.sliders }>
            <HueSlider
              gradientSteps={ 40 }
              onValueChange={ updateHue }
              style={ styles.sliderRow }
              value={ hslColor.h }
            />
            <SaturationSlider
              color={ hslColor }
              gradientSteps={ 20 }
              onValueChange={ updateSaturation }
              style={ styles.sliderRow }
              value={ hslColor.s }
            />
            <LightnessSlider
              color={ hslColor }
              gradientSteps={ 20 }
              onValueChange={ updateLightness }
              style={ styles.sliderRow }
              value={ hslColor.l }
            />
          </View>
          <View style={ {
            marginTop: 60
          } }
          >
            {
              matrixColorList.map((list) => {
                return (
                  <View key={ list[0] }
                    style={ styles.colorList }
                  >
                    {
                      list.map((color, index) => (
                        <RenderBlock
                          color={ color }
                          index={ index }
                          key={ color }
                        />
                      ))
                    }
                  </View>
                )
              })
            }
          </View>

        </ScrollView>
      </View>
    </Modal>
  )
}

export default observer(ColorPicker)

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#2F2F2F',
    justifyContent: 'flex-end',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: 60,
    paddingTop: 60 + isNewIPhone() ? 44 : 20,
    paddingHorizontal: 20
  },
  container: {
    flex: 1
  },
  betweenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  handleIcon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
    marginRight: 20
  },
  card: {
    height: 80,
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.4
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  btn: {
    width: btnWidth,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.2
  },
  btnText: {
    color: '#FFF'
  },
  sliderRow: {
    marginTop: 16
  },
  cardText: {
    fontSize: 18,
    fontFamily: 'Century Gothic',
    flex: 1,
    textAlign: 'center'
  },
  colorList: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  colorBlock: {
    height: blockSize,
    width: blockSize,
    borderRadius: 6
  }
})

ColorPicker.propTypes = {
  visible: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}
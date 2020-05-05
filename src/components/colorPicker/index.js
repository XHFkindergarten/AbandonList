/*
 * @Descripttion : 颜色选择器，基于react-native-color修改
 * @Author       : lizhaokang
 * @Date         : 2020-05-05 21:48:33
 */
import React, { useCallback, useState, useContext } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from 'react-native'
import { isNewIPhone } from 'src/utils'
import tinycolor from 'tinycolor2'
import PropTypes from 'prop-types'
import { down, correct } from 'src/assets/image'
import themeContext from 'src/themeContext'
import HueSlider from './sliders/HueSlider';
import SaturationSlider from './sliders/SaturationSlider';
import LightnessSlider from './sliders/LightnessSlider';

const btnWidth = (Dimensions.get('window').width - 60) / 4

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



function ColorPicker({ visible, color = '#000', onOk, onCancle }) {

  // 颜色用HSL格式来存储
  const [ hslColor, setColor ] = useState(tinycolor(color).toHsl())

  // 选择查看的模式
  const [ mode, setMode ] = useState('hex')

  const isDark = tinycolor(color).isDark()

  // 更新色值方法
  const updateHue = h => setColor({ ...hslColor, h });
  const updateSaturation = s => setColor({ ...hslColor, s });
  const updateLightness = l => setColor({ ...hslColor, l });

  const ModeButton = ({ mode : m }) => {
    const handleClick = useCallback(() => {
      setMode(m)
    }, m)
    return (
      <TouchableOpacity onPress={ handleClick }
        style={ [ styles.btn, { backgroundColor: m === mode ? theme.themeColor : 'transparent' } ] }
      >
        <Text style={ styles.btnText }>{ m }</Text>
      </TouchableOpacity>
    )
  }

  const theme = useContext(themeContext)
  return (
    <Modal
      animationType="slide"
      transparent
      visible={ visible }
    >
      <View style={ styles.wrapper }>
        <View style={ styles.container }>
          <View style={ styles.betweenRow }>
            <TouchableOpacity style={ {
              paddingVertical: 20,
              paddingRight: 20
            } }
            >
              <Image source={ down }
                style={ styles.handleIcon }
              />
            </TouchableOpacity>
            <TouchableOpacity style={ {
              paddingVertical: 20,
              paddingLeft: 20
            } }
            >
              <Image source={ correct }
                style={ styles.handleIcon }
              />
            </TouchableOpacity>
          </View>
          <View style={ [ styles.card, {
            backgroundColor: color,
            marginBottom: 20
          } ] }
          >
            <Text style={ {
              color: isDark ? '#FFF' : '#000',
              fontSize: 18
            } }
            >⁽⁽◞(꒪ͦᴗ̵̍꒪ͦ=͟͟͞͞ ꒪ͦᴗ̵̍꒪ͦ)◟⁾⁾</Text>
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
              style={ styles.sliderRow }
              value={ hslColor.h }
            />
            <SaturationSlider
              color={ hslColor }
              gradientSteps={ 20 }
              style={ styles.sliderRow }
              value={ hslColor.s }
            />
            <LightnessSlider
              color={ hslColor }
              gradientSteps={ 20 }
              style={ styles.sliderRow }
              value={ hslColor.l }
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ColorPicker

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  container: {
    flex: 1,
    backgroundColor: '#2F2F2F',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: 60,
    paddingTop: 60 + isNewIPhone() ? 44 : 20,
    paddingHorizontal: 20
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
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
    padding: 10
  },
  btnText: {
    color: '#FFF'
  },
  sliderRow: {
    marginTop: 16
  }
})

ColorPicker.propTypes = {
  visible: PropTypes.bool.isRequired,
  color: PropTypes.string,
  onOk: PropTypes.func,
  onCancle: PropTypes.func
}
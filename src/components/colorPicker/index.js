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
import { ScrollView } from 'react-native-gesture-handler';

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



function ColorPicker({ visible, color = '#FF0000', onOk, onCancel }) {
  // 颜色用HSL格式来存储
  const [ hslColor, setColor ] = useState(tinycolor(color).toHsl())

  // 选择查看的模式
  const [ mode, setMode ] = useState('hex')

  // 颜色是否是暗色
  const isDark = tinycolor(hslColor).isDark()


  // 更新色值方法
  const updateHue = h => {
    setColor({ ...hslColor, h })
  };
  const updateSaturation = s => setColor({ ...hslColor, s });
  const updateLightness = l => setColor({ ...hslColor, l });

  const handleOk = () => {
    onOk(renderColor)
  }

  const handleCancel = () => {
    onCancel()
    setColor(tinycolor(theme.themeColor).toHsl())
  }

  const ModeButton = ({ mode : m }) => {
    const handleClick = useCallback(() => {
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

  const theme = useContext(themeContext)

  const renderColor = tinycolor(hslColor).toHexString()

  const handleOnScroll = event => {
    const dy = event.nativeEvent.contentOffset.y
    if (dy < -80) {
      handleCancel()
    }
  }

  return (
    <Modal
      animationType="slide"
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
          onScroll={ handleOnScroll }
          scrollEventThrottle={ 1 }
          style={ styles.container }
        >

          <View style={ [ styles.card, {
            backgroundColor: renderColor,
            marginBottom: 20
          } ] }
          >
            <Text style={ {
              color: isDark ? '#FFF' : '#000',
              fontSize: 18
            } }
            >{ modes[mode].getString(hslColor) }</Text>
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
        </ScrollView>
      </View>
    </Modal>
  )
}

export default ColorPicker

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
    justifyContent: 'center',
    alignItems: 'center',
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
  }
})

ColorPicker.propTypes = {
  visible: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancle: PropTypes.func.isRequired
}
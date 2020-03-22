/*
 * @Descripttion : 月份名称
 * @Author       : lizhaokang
 * @Date         : 2020-02-15 21:06:13
 */
import React, { useRef, useMemo, useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { calendar } from 'src/assets/image'
import { vibrate } from 'src/utils'
import { Transitioning, Transition } from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler';
import themeContext from 'src/themeContext'
import store from './store'




function MonthName({ currentMonth, onPress, showCanlendar, showYear, AnimatedExpand }) {
  const [ firstMonth = 'Error', secondMonth = null ] = currentMonth
  // const [ hide, setHide ] = useState(false)
  const [ hideSec, setHideSec ] = useState(true)



  const [ AnimatedLogoOpacity ] = useState(new Animated.Value(1))

  const handleOnPress = () => {
    vibrate(0)
    onPress()
    Animated.timing(AnimatedLogoOpacity, {
      toValue: showCanlendar ? 1 : 0,
      duration: 300
    }).start()
    setHideSec(showCanlendar)
    if (showCanlendar) {
      AnimatedExpand.setValue(0)
      // 同步store中的动画状态
      store.shift = false
      store.isExpanded = false
    }
  }
  const AnimatedPaddingLeft = AnimatedLogoOpacity.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ 20, 0 ]
  })
  const transition = (
    <Transition.Sequence>
      <Transition.In delayMs={ 300 }
        durationMs={ 300 }
        type="fade"
      />
      { /* <Transition.Change interpolation /> */ }
      <Transition.Out durationMs={ 300 }
        type="fade"
      />
    </Transition.Sequence>
  )
  const ref = useRef()

  useMemo(() => {
    if (ref.current) {
      ref.current.animateNextTransition()
    }
  })

  const theme = useContext(themeContext)

  return (
    <TouchableOpacity onPress={ handleOnPress }>
      <View style={ {
        paddingBottom: showCanlendar ? 0 : 20
      } }
      >
        <Transitioning.View
          ref={ ref }
          style={ styles.container }
          transition={ transition }
        >
          <Animated.View style={ {
            paddingLeft: AnimatedPaddingLeft
          } }
          >
            <Text style={ [ styles.name, { color: theme.mainText } ] }>{ firstMonth.en }</Text>
            <View style={ {
              flexDirection: 'row',
              alignItems: 'center'
            } }
            >
              <Text style={ [ styles.subName, { color: theme.mainText } ] }>{ firstMonth.cn }</Text>
              <Text style={ [ styles.year, {
                color: theme.mainText
              } ] }
              >{ showYear }</Text>
            </View>

          </Animated.View>
          {
            secondMonth && !hideSec && (
              <Animated.View style={ {
                paddingRight: AnimatedPaddingLeft
              } }
              >
                <Text style={ [ styles.name, { color: theme.mainText }, { fontSize: 28 } ] }>{ secondMonth.cn }</Text>
                <Text style={ [ styles.subName, { color: theme.mainText }, {
                  fontFamily: 'Century Gothic',
                  textAlign: 'right'
                } ] }
                >{ secondMonth.en }</Text>
              </Animated.View>)
          }
        </Transitioning.View>
        <Animated.Image
          source={ calendar }
          style={ [ styles.calendarImage, {
            opacity: AnimatedLogoOpacity
          } ] }
        />
      </View>
    </TouchableOpacity>
  )
}

export default MonthName

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    // paddingLeft: 10,
    // paddingRight: 10,
    height: 60
  },
  name: {
    // color: '#DBDBDB',
    fontSize: 30,
    fontWeight: '900',
    fontFamily: 'Century Gothic'
  },
  subName: {
    fontSize: 16,
    fontWeight: '900'
  },
  year: {
    marginLeft: 5,
    fontSize: 16
  },
  calendar: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    position: 'absolute',
    left: 80,
    top: 10,
    transform: [ { translateY: 5 }, { translateX: 10 } ]
  },
  calendarImage: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    position: 'absolute',
    left: 80,
    top: 10,
    transform: [ { translateY: 5 }, { translateX: 10 } ]
  }
})
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




function MonthName({ currentMonth, onPress, showCanlendar }) {
  const [ firstMonth = 'Error', secondMonth = null ] = currentMonth
  const [ hide, setHide ] = useState(false)
  const [ hideSec, setHideSec ] = useState(true)

  const [ AnimatedLogoOpacity ] = useState(new Animated.Value(1))

  const handleOnPress = () => {
    vibrate(0)
    if (showCanlendar) {
      Animated.timing(AnimatedLogoOpacity, {
        toValue: 1,
        duration: 600
      }).start()
      setHideSec(true)
    } else {
      Animated.timing(AnimatedLogoOpacity, {
        toValue: 0,
        duration: 300
      }).start()
      setHideSec(false)
    }
    onPress()
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

  useEffect(() => {
    setHide(true)
    setTimeout(() => {
      setHide(false)
    })
  }, [ currentMonth.en ])

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
          { !hide && (
            <Animated.View style={ {
              paddingLeft: AnimatedPaddingLeft
            } }
            >
              <Text style={ [ styles.name, { color: theme.mainText } ] }>{ firstMonth.en }</Text>
              <Text style={ [ styles.subName, { color: theme.mainText } ] }>{ firstMonth.cn }</Text>
            </Animated.View>
          ) }
          {
            secondMonth && !hideSec && !hide && (
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
    // color: '#DBDBDB',
    fontSize: 16,
    fontWeight: '900'
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
/*
 * @Descripttion : 未来的卡片
 * @Author       : lizhaokang
 * @Date         : 2020-05-09 23:00:00
 */
import React, { useState, useContext } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
// import finishStore from './store'
import ExpandModal from './expandModal'
import { vibrate } from 'src/utils'
import themeContext from 'src/themeContext'
import { TapGestureHandler, State } from 'react-native-gesture-handler'



// 全局唯一定时器
// let pressTimeout = null
function FutureCard({ info }) {
  // const monthKey = moment(new Date(monthTime)).format('YYYY-MM')
  const [ expand, setExpand ] = useState(false)

  const theme = useContext(themeContext)

  const { isDelete } = info

  const [ animatedScale ] = useState(new Animated.Value(1))

  // const [ AnimatedScaleX ] = useState(new Animated.Value(1))
  // const disappearX = Animated.spring(AnimatedScaleX, { toValue: 0 })
  // const [ AnimatedHeightY ] = useState(new Animated.Value(300))
  // const disappearY = Animated.spring(AnimatedHeightY, { toValue: 0 })

  const _handleStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.BEGAN) {
      Animated.spring(animatedScale, {
        toValue: 0.98
      }).start(() => {
        Animated.timing(animatedScale, {
          toValue: 1,
          duration: 200
        }).start()
      })
    }
    if (nativeEvent.state === State.END) {
      vibrate(1)
      setExpand(true)
    }
  }


  return (
    <View>
      <TapGestureHandler
        onHandlerStateChange={ _handleStateChange }
      >
        <Animated.View style={ [ styles.card, {
          backgroundColor: theme.mainColor,
          transform: [ { scale: animatedScale } ]
        } ] }
        >
          <View style={ styles.cardHeader }>
            <View style={ [ styles.cardCircle, {
              backgroundColor: info.calendar.color
            } ] }
            />
            <Text
              numberOfLines={ 2 }
              style={ [
                styles.cardTitle, {
                  maxWidth: 200,
                  color: theme.pureText,
                  textDecorationLine: isDelete ? 'line-through' : 'none'
                }
              ] }
            >{ info.title }</Text>
          </View>
        </Animated.View>

      </TapGestureHandler>
      { expand &&
        <ExpandModal
          info={ info }
          setVisible={ setExpand }
        /> }
    </View>
  )

}

export default FutureCard

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  card: {
    borderRadius: 6,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 2 },
    minHeight: 80
  },
  // 卡片标题
  cardTitle: {
    // color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 18
  },
  cardCircle: {
    marginTop: 3,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginRight: 6
  }

})

/**
 * 引导页
 */
import React, { useContext, useCallback, useState, useEffect, Fragment } from 'react';
import { StyleSheet, SafeAreaView, Text, Animated, TouchableOpacity } from 'react-native';
import ThemeContext from 'src/themeContext'
import store from 'src/store'
import { useFocusEffect } from '@react-navigation/native';
import { correct, calendar, down, notification } from 'src/assets/image'
import nativeCalendar from 'src/utils/nativeCalendar'
import Notification from 'src/utils/Notification'
import AsyncStorage from '@react-native-community/async-storage'


const firstLaunchKey = '@first_launch_key'

function FirstScreen({ handleEnd }) {

  const theme = useContext(ThemeContext)

  useEffect(() => {
    Animated.timing(word1Progress, {
      toValue: 1,
      duration: 400,
      delay: 100
    }).start()
    Animated.timing(word2Progress, {
      toValue: 1,
      duration: 400
    }).start()
    Animated.spring(btnProgress, {
      toValue: 1
    }).start()
  })


  const [ word1Progress ] = useState(new Animated.Value(0))
  const [ word2Progress ] = useState(new Animated.Value(0))
  const [ btnProgress ] = useState(new Animated.Value(0))
  const [ logoProgress ] = useState(new Animated.Value(1))
  const [ logoScale ] = useState(new Animated.Value(1))


  const onPressBtn = () => {
    Animated.timing(word1Progress, {
      toValue: 0,
      duration: 400
    }).start()
    Animated.timing(word2Progress, {
      toValue: 0,
      duration: 400,
      delay: 100
    }).start()
    Animated.timing(logoProgress, { toValue: 0 } ).start()
    Animated.timing(logoScale, { toValue: 0.8 }).start(() => {
      Animated.timing(logoScale, {
        toValue: 20
      }).start(() => {
        if (typeof handleEnd === 'function') {
          handleEnd()
        }
      })
    })
  }

  return (
    <Fragment>
      <Animated.View style={ [  {
        opacity: word1Progress
      } ] }
      >
        <Text style={ styles.label }>
          感谢使用AbandonList
        </Text>
      </Animated.View>
      <Animated.View style={ [  {
        opacity: word2Progress
      } ] }
      >
        <Text style={ styles.subLabel }>
            AbandonList是一款日程管理App
        </Text>
        <Text style={ styles.subLabel }>
          检视当周计划和每日任务来完成日程管理
        </Text>
      </Animated.View>

      <TouchableOpacity
        onPress={ onPressBtn }
        style={ {
          marginTop: 200
        } }
      >
        <Animated.View style={ [ styles.dot, {
          backgroundColor: '#000',
          transform: [ { scale: btnProgress }, { scale: logoScale }  ],
          shadowColor: '#000',
          shadowOpacity: 0.6,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 4 }
        } ] }
        >
          <Animated.Image source={ correct }
            style={ [ styles.icon, {
              opacity: logoProgress,
              transform: [ { translateY: 3 } ]
            } ] }
          />
        </Animated.View>
      </TouchableOpacity>
    </Fragment>
  )

}
function SecondScreen({ handleEnd }) {

  const theme = useContext(ThemeContext)

  useEffect(() => {
    Animated.timing(word1Progress, {
      toValue: 1,
      duration: 400,
      delay: 100
    }).start()
    Animated.timing(word2Progress, {
      toValue: 1,
      duration: 400
    }).start()
    Animated.spring(btnProgress, {
      toValue: 1
    }).start()
  })


  const [ word1Progress ] = useState(new Animated.Value(0))
  const [ word2Progress ] = useState(new Animated.Value(0))
  const [ btnProgress ] = useState(new Animated.Value(0))
  const [ logoProgress ] = useState(new Animated.Value(1))
  const [ logoScale ] = useState(new Animated.Value(1))

  const [ calendarText, setCalendarText ] = useState(true)

  const onPressBtn = () => {
    nativeCalendar.checkAuth().then(() => {
      // 获得授权，初始化日历数据
      nativeCalendar.initialVisibleGroup().then(() => {
        // 获取日历所有分组信息[默认只显示默认日历的信息]
        nativeCalendar.getCalendarGroups().then(() => {
          // 获取事件
          store.initialStorageData()
        })
      })
    })
      .catch(e => {
        console.log(e)
      })
      .finally(() => {
        Animated.timing(logoProgress, {
          toValue: 0,
          duration: 400
        }).start()
        Animated.timing(word1Progress, {
          toValue: 0,
          duration: 400
        }).start()
        Animated.timing(word2Progress, {
          toValue: 0,
          duration: 400,
          delay: 100
        }).start(() => {
          setCalendarText(false)
          Animated.timing(word1Progress, {
            toValue: 1,
            duration: 400,
            delay: 100
          }).start()
          Animated.timing(word2Progress, {
            toValue: 1,
            duration: 400
          }).start()
          Animated.timing(logoProgress, {
            toValue: 1,
            duration: 400
          }).start()
        })
      })
  }



  const onPressNoti = () => {
    Notification.initialNotification().then(() => {
      Notification.initialListener()
    }).finally(() => {
      Animated.timing(word2Progress, {
        toValue: 0
      }).start()
      Animated.timing(btnProgress, {
        toValue: 0
      }).start(() => {
        setTimeout(() => {
          if (typeof handleEnd === 'function') {
            handleEnd()
          }
        }, 500)
      })
    })
  }

  return (
    <Fragment>
      <Animated.View style={ [  {
        opacity: word2Progress
      } ] }
      >
        {
          calendarText ? (
            <Fragment>
              <Text style={ styles.subLabel_2 }>
              为了管理您的日程
              </Text>
              <Text style={ styles.subLabel_2 }>
              需要获得本机的日历读写权限^ ^.
              </Text>

            </Fragment>
          ) : (
            <Fragment>
              <Text style={ styles.subLabel_2 }>
                为了提供日程提醒服务
              </Text>
              <Text style={ styles.subLabel_2 }>
                需要获得本机的通知权限^ ^
              </Text>
            </Fragment>
          )
        }
      </Animated.View>

      <TouchableOpacity
        onPress={ calendarText ? onPressBtn : onPressNoti }
        style={ {
          marginTop: 200
        } }
      >
        <Animated.View style={ [ styles.dot, {
          backgroundColor: theme.themeColor,
          opacity: btnProgress,
          transform: [ { scale: logoScale }  ],
          shadowColor: theme.themeColor,
          shadowOpacity: 0.6,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 4 }
        } ] }
        >
          <Animated.Image source={ calendarText ? calendar : notification }
            style={ [ styles.icon, {
              opacity: logoProgress
            } ] }
          />
        </Animated.View>
      </TouchableOpacity>
    </Fragment>
  )

}

function ThirdScreen( { handleEnd }) {
  const theme = useContext(ThemeContext)
  const [ titleProgress ] = useState(new Animated.Value(0))
  const [ subtitleProgress ] = useState(new Animated.Value(0))
  const [ fadeBtn ] = useState(new Animated.Value(0))
  const [ titleLeft ] = useState(new Animated.Value(0))
  const [ subtitleLeft ] = useState(new Animated.Value(0))
  const [ logoFade ] = useState(new Animated.Value(1))
  const [ btnScale ] = useState(new Animated.Value(1))
  useEffect(() => {
    Animated.spring(titleProgress, {
      toValue: 1,
      delay: 300
    }).start()
    Animated.spring(subtitleProgress, {
      toValue: 1
    }).start()
    Animated.spring(fadeBtn, {
      toValue: 1
    }).start()
  }, [])
  const downProgress1 = titleProgress.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ -300, 0 ]
  })
  const downProgress2 = subtitleProgress.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ -300, 0 ]
  })

  const handlePress = () => {
    Animated.timing(titleLeft, {
      toValue: -400,
      duration: 500,
      delay: 200
    }).start()
    Animated.timing(subtitleLeft, {
      toValue: -400,
      duration: 500
    }).start()
    Animated.timing(logoFade, {
      toValue: 0
    }).start(() => {
      Animated.timing(btnScale, {
        toValue: 20
      }).start(() => {
        Animated.timing(fadeBtn, {
          toValue: 0,
          duration: 600
        }).start(() => {
          if (typeof handleEnd === 'function') {
            handleEnd()
          }
        })
      })
    })
  }



  return (
    <Fragment>
      <Animated.Text style={ [ styles.thirdTitle, {
        transform: [
          { translateY: downProgress1 },
          { translateX: titleLeft }
        ]
      } ] }
      >
        AbandonList
      </Animated.Text>
      <Animated.View style={ {
        transform: [
          { translateY: downProgress2 },
          { translateX: subtitleLeft }
        ]
      } }
      >
        <Text style={ styles.thirdSubtitle }>
          将每一项工作安排在可执行的时间。
        </Text>
        <Text style={ styles.thirdSubtitle }>
          养成良好的学习生活习惯
        </Text>
      </Animated.View>
      <TouchableOpacity
        onPress={ handlePress }
        style={ {
          marginTop: 200
        } }
      >
        <Animated.View style={ [ styles.dot, {
          opacity: fadeBtn,
          backgroundColor: theme.themeColor,
          transform: [ { scale: btnScale } ]
        } ] }
        >
          <Animated.Image source={ down }
            style={ [ styles.icon, {
              opacity: logoFade,
              transform: [
                { rotate: '270deg' }
              ]
            } ] }
          />
        </Animated.View>
      </TouchableOpacity>
    </Fragment>
  )
}






export default function Guide({ navigation }) {

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      store.updateBottomNavName('Guide')
      store.setShowBottom(false)
      return () => {
        // Do something when the screen is unfocused
        store.setShowBottom(true)
      }
    }, [])
  )


  const theme = useContext(ThemeContext)

  const [ screenIndex, setIndex ] = useState(0)

  const handleFirstEnd = () => setIndex(1)

  const handleSecondEnd = () => {
    setIndex(2)
  }

  const handleThirdEnd = () => {
    AsyncStorage.setItem(firstLaunchKey, '@&^(!whatever_string_it_is')
    navigation.navigate('Main')
  }

  const backgroundColor = screenIndex === 0 ? theme.themeColor : (screenIndex === 1 ? '#000' : '#000')

  return (
    <SafeAreaView style={ [ styles.container, {
      backgroundColor
    } ] }
    >
      {
        screenIndex === 0 && (
          <FirstScreen handleEnd={ handleFirstEnd } />
        )
      }
      {
        screenIndex === 1 && (
          <SecondScreen handleEnd={ handleSecondEnd } />
        )
      }
      {
        screenIndex === 2 && (
          <ThirdScreen handleEnd={ handleThirdEnd } />
        )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 40
  },
  subLabel: {
    color: '#FFF',
    lineHeight: 30,
    fontSize: 16,
    width: 300,
    fontWeight: '300',
    textAlign: 'center'
  },
  subLabel_2: {
    color: '#dbdbdb',
    lineHeight: 30,
    fontSize: 16,
    width: 300,
    fontWeight: '300',
    textAlign: 'center'
  },
  dot: {
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    height: 30,
    width: 30
  },
  thirdTitle: {
    fontFamily: 'ADAM.CG PRO',
    fontSize: 32,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20
  },
  thirdSubtitle: {
    width: 300,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 24
  }
})
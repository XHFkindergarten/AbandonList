import React, { useState, useEffect, useRef } from 'react';
import { Modal, Text, TouchableWithoutFeedback, View, Dimensions, Animated, StyleSheet, Image } from 'react-native'
import { BlurView } from '@react-native-community/blur';
import { info_, time, list, correctGreen, wrongRed } from 'src/assets/image'
import srcStore from 'src/store'
import { fromNow } from 'src/utils'
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window')
const CardExpandModal = ({ setVisible, info, handleAbandon, handleFinish }) => {
  console.log('card expanded', info)
  const handleClose = () => {
    setVisible(false)
    srcStore.preventOtherHandler = false
  }
  const [ AnimatedScale ] = useState(new Animated.Value(0.2))
  // component did mount
  useEffect(() => {
    Animated.spring(AnimatedScale, {
      toValue: 1
    }).start()
  }, [])

  const outputTime = fromNow(info)
  return (
    <Modal
      animationType="fade"
      transparent
      visible
    >
      <TouchableWithoutFeedback onPress={ handleClose }>
        <BlurView
          blurAmount={ 10 }
          blurType="extraDark"
          style={ {
            flex: 1
          } }
        />
      </TouchableWithoutFeedback>
      <Animated.View style={ [ styles.card, {
        transform: [ { scaleY: AnimatedScale } ]
      } ] }
      >
        <View>
          <Text style={ styles.cardName }>{ info.title }</Text>
          <View style={ {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          } }
          >
            <View style={ [ styles.circle, {
              backgroundColor: info.calendar.color
            } ] }
            />
            <Text style={ {
              color: '#FFF',
              fontSize: 16,
              fontWeight: '500'
            } }
            >{ info.calendar.title }</Text>
          </View>
          <View style={ styles.row }>
            <Image source={ info_ }
              style={ styles.icon }
            ></Image>
            <Text style={ styles.content }>{ info.notes ? info.notes : 'No Description' }</Text>
          </View>
          <View style={ styles.row }>
            <Image source={ time }
              style={ styles.icon }
            ></Image>
            <Text style={ styles.content }>{ outputTime }</Text>
          </View>
        </View>
        <View style={ {
          position: 'absolute',
          bottom: -80,
          width: width - 40,
          flexDirection: 'row',
          justifyContent: 'space-around'
        } }
        >
          <TouchableOpacity
            onPress={ handleFinish }
            style={ {
              padding: 20
            } }
          >
            <Image source={ correctGreen }
              style={ styles.handleIcon }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ handleAbandon }
            style={ {
              padding: 20
            } }
          >
            <Image source={ wrongRed }
              style={ styles.handleIcon }
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  )
}

export default (CardExpandModal)

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2F2F2F',
    width: width - 40,
    // height: 500,
    position: 'absolute',
    top: height / 2 - 200,
    left: 20,
    borderRadius: 6,
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20
  },
  cardName: {
    fontSize: 24,
    lineHeight: 30,
    color: '#FFF',
    marginBottom: 10,
    // fontWeight: '900',
    textAlign: 'center'
  },
  row: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  circle: {
    height: 14,
    width: 14,
    borderRadius: 7,
    marginRight: 5
  },
  icon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 10
  },
  content: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '300',
    flex: 1
  },
  handleIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  }
})
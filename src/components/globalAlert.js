/**
 * 全局提示框
 */
import React from 'react';
import dailyStore from './dailyStore'
import { Modal, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Text, Dimensions } from 'react-native';
const { width } = Dimensions.get('window')
export default function GlobalAlert ({ visible, setVisible, target }) {
  const handleCloseModal = () => {
    setVisible(false)
  }
  // const [ top, setTop ] = useState(0)
  const handleCancel = () => {
    setVisible(false)
  }
  const handleDelete = () => {
    dailyStore.deleteDailyListItem(target.id)
    setVisible(false)
    dailyStore.setIsSet(false)
  }
  return (
    <Modal
      animationType="fade"
      transparent
      visible={ visible }
    >
      <TouchableWithoutFeedback onPress={ handleCloseModal }>
        <View style={ styles.container } />
      </TouchableWithoutFeedback>
      <View
        // onLayout={ eve => setTop(height / 2 - eve.nativeEvent.layout.height / 2) }
        style={ [ styles.modal, {
          top: 300
        } ] }
      >
        <Text style={ styles.title }>提示</Text>
        <Text style={ styles.content }>删除事项后无法恢复，但过去的完成数据仍然有效</Text>
        <View style={ styles.footer }>
          <TouchableOpacity
            onPress={ handleCancel }
            style={ {
              flex: 1
            } }
          >
            <View style={ styles.button }>
              <Text style={ styles.btnText }>取消</Text>
            </View>
          </TouchableOpacity>
          <View style={ {
            height: 50,
            width: 1,
            backgroundColor: '#444'
          } }
          ></View>
          <TouchableOpacity
            onPress={ handleDelete }
            style={ {
              flex: 1
            } }
          >
            <View style={ styles.button }>
              <Text style={ [ styles.btnText, {
                color: '#d91e18'
              } ] }
              >删除</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  modal: {
    width: 280,
    left: width / 2 - 140,
    position: 'absolute',
    backgroundColor: 'rgba(47,47,47,0.95)',
    borderRadius: 14,
    paddingTop: 30
  },
  title: {
    color: '#999',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  },
  content: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    lineHeight: 20
  },
  footer: {
    flexDirection: 'row',
    borderTopColor: '#444',
    borderTopWidth: 1,
    marginTop: 20
    // width: 280
  },
  button: {
    // flex: 1,
    height: 50,
    // backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    color: '#2e73bd',
    fontSize: 16
  }
})
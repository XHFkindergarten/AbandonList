import React from 'react';
import { View, Modal, StyleSheet, Image, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { down } from 'src/assets/image'
function EndModal({ visible, handleClose, endTime, setEndTime }) {
  const onDateChange = (event, newDate) => setEndTime(newDate)
  return (
    <Modal
      animationType="slide"
      transparent
      visible={ visible }
    >
      <View style={ [ styles.wrapper ] }>
        <View style={ styles.container }>
          <View style={ styles.header } >
            <TouchableOpacity onPress={ handleClose }>
              <Image source={ down }
                style={ styles.closeIcon }
              />
            </TouchableOpacity>
          </View>
          <DateTimePicker
            mode="datetime"
            onChange={ onDateChange }
            value={ endTime }
          />
        </View>
      </View>
    </Modal>
  )
}
export default EndModal

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  container: {
    backgroundColor: '#2F2F2F',
    // height: 500,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: 60
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20
  },
  closeIcon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
    marginRight: 20
  },
  pickerItem: {
    color: '#FFF'
  }
})

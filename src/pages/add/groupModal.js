import React, { useState } from 'react';
import { View, Modal, StyleSheet, Image, TouchableOpacity, Picker, PanResponder, Animated } from 'react-native'
import { down } from 'src/assets/image'
function GroupModal({ visible, handleClose, selectGroupId, groups, setSelectGroupId }) {
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
          <Picker
            itemStyle={ {
              color: '#FFF'
            } }
            onValueChange={ itemValue => setSelectGroupId(itemValue) }
            selectedValue={ selectGroupId }
          >
            { groups.map((item, index) => (
              <Picker.Item
                key={ selectGroupId }
                label={ item.title }
                value={ item.id }
              />
            )) }
          </Picker>
        </View>
      </View>
    </Modal>
  )
}

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

export default GroupModal
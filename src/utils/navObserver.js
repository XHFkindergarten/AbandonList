import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import store from 'src/store'
const Output = Name => Target => {
  return function() {
    useFocusEffect(
      useCallback(() => {
        // Do something when the screen is focused
        store.updateBottomNavName(Name)
        return () => {
          // Do something when the screen is unfocused
        }
      }, [])
    )
    return (
      <Target />
    )
  }
}

export default Output
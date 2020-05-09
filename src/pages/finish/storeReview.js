import React, { Fragment } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { appStore } from 'src/assets/image'
import * as AppStoreReview from 'react-native-store-review'
import srcStore from 'src/store'
/**
 * 在App Store中进行评分
 */
function StoreReview() {
  const handlePress = () => {
    if (AppStoreReview.isAvailable) {
      AppStoreReview.requestReview();
    } else {
      srcStore.globalNotify('无法连接到App Store')
    }
  }
  return (
    <View style={ {
      alignItems: 'center',
      marginBottom: 60
    } }
    >
      <TouchableOpacity onPress={ handlePress }>
        <View style={ styles.container }>
          <Text style={ styles.title }>评分</Text>
          <Image source={ appStore }
            style={ styles.addCircle }
          />
        </View>
      </TouchableOpacity>
      <Text style={ [ styles.subTitle , {
        marginTop: 20
      } ] }
      >在App Store中对AbandonList进行评分</Text>
    </View>
  )
}

export default StoreReview

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  subTitle: {
    lineHeight: 20,
    textAlign: 'center',
    color: '#8a8a8a',
    fontSize: 14,
    width: 300
  },
  addCircle: {
    height: 24,
    width: 24
  }
})
import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';

export default class AppleStyleSwipeableRow extends Component {
  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [ 0, 50, 100, 101 ],
      outputRange: [ -20, 0, 0, 1 ]
    });
    return (
      <RectButton onPress={ this.close }
        style={ styles.leftAction }
      >
        <Animated.Text
          style={ [
            styles.actionText,
            {
              transform: [ { translateX: trans } ]
            }
          ] }
        >
          Archive
        </Animated.Text>
      </RectButton>
    );
  };
  renderRightAction = (text, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ x, 0 ]
    });
    const pressHandler = () => {
      this.close();
    };
    return (
      <Animated.View style={ { flex: 1, transform: [ { translateX: trans } ] } }>
        <RectButton
          onPress={ pressHandler }
          style={ [ styles.rightAction, { backgroundColor: color } ] }
        >
          <Text style={ styles.actionText }>{ text }</Text>
        </RectButton>
      </Animated.View>
    );
  };
  renderRightActions = progress => (
    <View style={ { width: 192, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' } }>
      { this.renderRightAction('More', '#C8C7CD', 192, progress) }
      { this.renderRightAction('Flag', '#ffab00', 128, progress) }
      { this.renderRightAction('More', '#dd2c00', 64, progress) }
    </View>
  );
  updateRef = ref => {
    this._swipeableRow = ref;
  };
  close = () => {
    this._swipeableRow.close();
  };
  render() {
    const { children } = this.props;
    return (
      <Swipeable
        friction={ 2 }
        leftThreshold={ 30 }
        ref={ this.updateRef }
        renderLeftActions={ this.renderLeftActions }
        renderRightActions={ this.renderRightActions }
        rightThreshold={ 40 }
      >
        { children }
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    // flex: 1,
    width: 100,
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
});

import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default class GmailStyleSwipeableRow extends Component {
  renderLeftActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [ 0, 80 ],
      outputRange: [ 0, 1 ],
      extrapolate: 'clamp'
    });
    return (
      <RectButton onPress={ this.close }
        style={ styles.leftAction }
      >
        { /* <AnimatedIcon
          color="#fff"
          name="archive"
          size={ 30 }
          style={ [ styles.actionIcon, { transform: [ { scale } ] } ] }
        /> */ }
        <Animated.Text style={ {
          transform: [ { scale } ]
        } }
        >test</Animated.Text>
      </RectButton>
    );
  };
  renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [ -80, 0 ],
      outputRange: [ 1, 0 ],
      extrapolate: 'clamp'
    });
    return (
      <RectButton onPress={ this.close }
        style={ styles.rightAction }
      >
        <Animated.Text style={ {
          transform: [ { scale } ]
        } }
        >test</Animated.Text>
      </RectButton>
    );
  };
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
        leftThreshold={ 80 }
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
    flex: 1,
    backgroundColor: '#388e3c',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse'
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10
  },
  rightAction: {
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    backgroundColor: '#dd2c00',
    flex: 1,
    justifyContent: 'flex-end'
  }
});


import React, { Component } from 'react'
import { View, Animated, Easing } from 'react-native'

export default class App extends Component {
  spinValue = new Animated.Value(0)

  componentDidMount() {
    this.spin()
  }

  spin = () => {
    this.spinValue.setValue(0)

    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
    }).start(() => this.spin())
  }

  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    })
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.Image
          style={{
            width: 227,
            height: 200,
            transform: [{ rotate: spin }],
          }}
          source={{
            uri: 'https://cdn.imgbin.com/1/9/13/imgbin-clark-kent.jpg',
          }}
        />
      </View>
    )
  }
}

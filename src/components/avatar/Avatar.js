/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Image} from 'react-native';

import * as Color from '../config/color';
import Space from '../layout/Space';

export default class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.loading ? this.props.loading : false,
    };
  }

  async onPress() {
    this.setState({loading: true});
    await this.props.onPress();
    this.setState({loading: false});
  }

  render() {
    return (
      <View
        activeOpacity={0.81}
        disabled={this.state.loading ? true : false}
        onPress={this.onPress.bind(this)}
        style={[styles.container, this.props.style]}>
        <Image
          style={[styles.profilImg, this.props.styleImg]}
          source={
            this.props.url
              ? {uri: this.props.url}
              : require('../../assets/img/logo.png')
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: 36,
    width: 36,
    borderRadius: 180,
    backgroundColor: Color.componentBg,
  },
  profilImg: {
    flex: 1,
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: Color.darkMagenta,
    borderRadius: 180,
  },
});

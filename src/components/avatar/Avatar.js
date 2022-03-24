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
          style={styles.profilImg}
          source={
            this.props.url
              ? this.props.url
              : require('../../assets/img/logo.png')
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: 45,
    width: 45,
    borderRadius: 180,
    backgroundColor: Color.componentBg,
  },
  profilImg: {
    flex: 1,
    width: 45,
    height: 45,
    borderWidth: 3,
    borderColor: Color.darkMagenta,
    borderRadius: 180,
  },
});

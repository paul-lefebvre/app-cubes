import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';

import * as Color from '../config/color';

class ButtonLarge extends React.Component {
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
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={this.state.loading ? true : false}
        onPress={this.onPress.bind(this)}
        style={[styles.button, this.props.style]}>
        {this.state.loading ? (
          <ActivityIndicator color={'white'} />
        ) : (
          <Text style={styles.text}>{this.props.title}</Text>
        )}
      </TouchableOpacity>
    );
  }
}

let width =
  Dimensions.get('window').width - Dimensions.get('window').width * 0.1;

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    height: 60,
    justifyContent: 'center',
    width: width,
    backgroundColor: Color.secondColor,
    borderRadius: 12,
  },
  text: {
    flex: 0.5,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 21,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: Color.colorBackground,
  },
});

export default ButtonLarge;

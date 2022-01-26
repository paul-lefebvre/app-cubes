/* eslint-disable no-unused-vars */
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import * as Color from '../config/color';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';

export default class ButtonIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.color ? this.props.color : 'black',
      icon: this.props.icon ? this.props.icon : faExclamationTriangle,
      size: this.props.size ? this.props.size : 21,
      activeOpacity: this.props.activeOpacity ? this.props.activeOpacity : 0.9,
      noBorder: this.props.noBorder ? this.props.noBorder : false,
    };
  }

  async onPress() {
    await this.props.onPress();
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={this.state.activeOpacity}
        onPress={this.onPress.bind(this)}
        style={[
          styles.button,
          this.props.style,
          {
            width:
              this.state.noBorder === false
                ? this.state.size * 2
                : this.state.size,
            height:
              this.state.noBorder === false
                ? this.state.size * 2
                : this.state.size,
          },
        ]}>
        <FontAwesomeIcon
          icon={this.state.icon}
          size={this.state.size}
          color={this.state.color}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
    width: 60,
    backgroundColor: 'white',
    borderRadius: 60,
  },
});

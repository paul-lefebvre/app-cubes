/* eslint-disable react-native/no-inline-styles */
import { faChessRook, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  View,
  Platform,
  Dimensions,
} from 'react-native';

import * as Color from '../config/color';

class ButtonUnfilled extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.loading ? this.props.loading : false,
      disabled: this.props.disabled ? this.props.disabled : false,
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
        activeOpacity={0.3}
        disabled={this.props.disabled ? this.props.disabled : false}
        onPress={this.onPress.bind(this)}
        style={[styles.button, this.props.style]}>
        {this.state.loading ? (
          <ActivityIndicator color={'white'} />
        ) : (
          <View style={styles.innerButton}>
            <Text
              style={[
                styles.text,
                {color: this.props.iconColor ? this.props.iconColor : 'black'},
              ]}>
              {this.props.title}
            </Text>
            <FontAwesomeIcon
              color={this.props.iconColor ? this.props.iconColor : 'black'}
              size={30}
              icon={this.props.icon ? this.props.icon : faChevronRight}
            />
          </View>
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
    height: 81,
    justifyContent: 'center',
    width: width,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 12,
  },
  innerButton: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 9,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  text: {
    flex: 0.7,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 21,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: 'black',
  },
});

export default ButtonUnfilled;

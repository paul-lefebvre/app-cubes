import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';

import * as Color from '../config/color';

export default class BigTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Text style={styles.text}>
        {this.props.text ? this.props.text : '<INSERT TITLE>'}
      </Text>
    );
  }
}

let width =
  Dimensions.get('window').width - Dimensions.get('window').width * 0.5;

const styles = StyleSheet.create({
  text: {
    flex: 0.2,
    fontSize: 36,
    textAlign: 'center',
    fontFamily: 'Montserrat-ExtraBold',
  },
});

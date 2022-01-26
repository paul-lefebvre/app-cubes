/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View} from 'react-native';

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: this.props.progress ? this.props.progress : '5%',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.bar,
            {
              width: this.state.progress,
              borderTopRightRadius: this.state.progress >= '95%' ? 32 : 0,
              borderBottomRightRadius: this.state.progress >= '95%' ? 32 : 0,
            },
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    justifyContent: 'center',
    width: '90%',
    backgroundColor: 'lightgrey',
    borderRadius: 32,
  },
  bar: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    backgroundColor: 'grey',
  },
});

export default ProgressBar;

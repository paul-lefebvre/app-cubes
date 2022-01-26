/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';

import Space from '../../components/layout/Space';

export default class FullScreenLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: this.props.children,
      loading: this.props.loading,
      text: this.props.text ? this.props.text : '',
      error: this.props.error ? this.props.error : false,
    };
  }

  UNSAFE_componentWillReceiveProps(props, nextProps) {
    this.setState({loading: props.loading});
    this.setState({text: props.text});
    this.setState({error: props.error});
  }

  render() {
    const state = this.state;
    return (
      <>
        {state.loading ? (
          <View style={[styles.container, {}]}>
            <Space size={280} />
            <ActivityIndicator
              size={90}
              color={'white'}
              animating={state.loading}
            />
            <Text style={[styles.text, {color: state.error ? 'red' : 'white'}]}>
              {state.text}
            </Text>
            {state.children}
          </View>
        ) : (
          <></>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  text: {
    color: 'white',
    flex: 0.5,
    fontSize: 21,
    textAlign: 'center',
  },
});

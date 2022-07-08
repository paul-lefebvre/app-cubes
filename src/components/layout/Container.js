/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {colorBackground} from '../config/color';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: this.props.children,
      justifyContent: this.props.justifyContent
        ? this.props.justifyContent
        : null,
      alignItems: this.props.alignItems ? this.props.alignItems : null,
      backgroundColor: this.props.backgroundColor
        ? this.props.backgroundColor
        : 'white',
    };
  }

  UNSAFE_componentWillReceiveProps(props, newProps) {
    this.setState({children: props.children});
  }

  render() {
    const state = this.state;
    return (
      <ScrollView
        scrollEnabled={
          this.props.scrollEnabled ? this.props.scrollEnabled : true
        }
        style={[{backgroundColor: state.backgroundColor}, styles.container]}
        contentContainerStyle={[
          {
            flex: this.props.scrollEnabled ? null : 1,
            justifyContent: state.justifyContent,
            alignItems: state.alignItems,
          },
        ]}>
        {state.children}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default Container;

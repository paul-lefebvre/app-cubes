import React from 'react';
import {View} from 'react-native';

class Space extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: this.props.size ? this.props.size : 20,
      width: this.props.width ? this.props.width : null,
    };
  }

  render() {
    const state = this.state;
    return (
      <View
        style={{
          height: state.size,
          width: state.width,
        }}
      />
    );
  }
}

export default Space;

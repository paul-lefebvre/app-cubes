/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

export default class Infos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayInfos: this.props.displayInfos ? this.props.displayInfos : false,
      isAnError: this.props.isAnError ? this.props.isAnError : false,
      text: this.props.text ? this.props.text : '',
    };
  }

  render() {
    const state = this.state;
    return (
      <>
        {state.displayInfos ? (
          <View style={[styles.infoNetwork, this.props.style]}>
            <FontAwesomeIcon
              icon={state.isAnError ? faExclamationTriangle : faInfoCircle}
              size={30}
              color={'black'}
            />
            <Text style={{color: 'black', marginLeft: 12}}>{state.text}</Text>
          </View>
        ) : null}
      </>
    );
  }
}

// export default CustomAlertComponent;

const styles = StyleSheet.create({
  infoNetwork: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    padding: 12,
    borderRadius: 9,
    marginHorizontal: 30,
  },
});

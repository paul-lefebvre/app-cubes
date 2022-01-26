import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import AlertCustom from '../alerts/AlertCustom';

import * as Color from '../config/color';

class CounterLarge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.loading ? this.props.loading : false,
      showAlert: false,
    };
  }

  async onPress() {
    this.setState({showAlert: true});
  }

  render() {
    const state = this.state;
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.97}
          onPress={this.onPress.bind(this)}
          disabled={this.props.infos ? false : true}
          style={[styles.container, this.props.style]}>
          <Text style={styles.text}>{this.props.description}</Text>
          <View style={styles.containerNumber}>
            <Text style={styles.number}>{this.props.number}</Text>
            {this.props.icon ? (
              <FontAwesomeIcon
                icon={this.props.icon}
                size={18}
                color={'black'}
              />
            ) : null}
          </View>
        </TouchableOpacity>
        <AlertCustom
          displayAlert={state.showAlert}
          alertTitleText={'Informations'}
          displayAlertIcon={true}
          icon={faInfoCircle}
          alertMessageText={this.props.infos}
          displayPositiveButton={true}
          positiveButtonText={'OK'}
          displayNegativeButton={false}
          onPressPositiveButton={() => this.setState({showAlert: false})}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '90%',
    borderRadius: 12,
    backgroundColor: Color.secondColor,
  },
  text: {
    flex: 0.9,
    alignSelf: 'center',
    marginLeft: 18,
    alignContent: 'center',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.1,
    color: Color.colorBackground,
  },
  containerNumber: {
    flex: 0.3,
    paddingVertical: 3,
    backgroundColor: 'lightgrey',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopStartRadius: 9,
    borderBottomLeftRadius: 9,
  },
  number: {
    fontWeight: 'bold',
    fontSize: 21,
    color: 'black',
  },
});

export default CounterLarge;

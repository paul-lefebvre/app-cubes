/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Modal, View, Text, TouchableOpacity, Platform} from 'react-native';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

export default class AlertCustom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayAlert: this.props.displayAlert ? this.props.displayAlert : false,
    };
  }

  onNegativeButtonPress = () => {
    this.props.onPressNegativeButton();
  };

  onPositiveButtonPress = () => {
    this.props.onPressPositiveButton();
  };

  render() {
    return (
      <Modal
        visible={this.props.displayAlert}
        transparent={true}
        animationType={'fade'}>
        <View style={styles.mainOuterComponent}>
          <View
            style={[
              styles.mainContainer,
              this.props.alertMessageText &&
              this.props.alertMessageText.length > 90
                ? {height: '45%'}
                : {height: '35%'},
            ]}>
            {/* First ROw - Alert Icon and Title */}
            <View style={styles.topPart}>
              {this.props.displayAlertIcon && (
                <FontAwesomeIcon
                  icon={this.props.icon}
                  size={21}
                  color={'white'}
                />
              )}
              <Text style={styles.alertTitleTextStyle}>
                {`${this.props.alertTitleText}`}
              </Text>
            </View>
            {/* Second Row - Alert Message Text */}
            <View style={styles.middlePart}>
              <Text style={styles.alertMessageTextStyle}>
                {`${this.props.alertMessageText}`}
              </Text>
            </View>
            {/* Third Row - Positive and Negative Button */}
            <View style={styles.bottomPart}>
              {this.props.displayPositiveButton && (
                <TouchableOpacity
                  onPress={this.onPositiveButtonPress}
                  style={[
                    styles.alertMessageButtonStyle,
                    this.props.alertTitleText === 'Erreur'
                      ? {backgroundColor: 'red'}
                      : null ||
                        this.props.alertTitleText === 'Informations' ||
                        this.props.alertTitleText === 'Information'
                      ? {backgroundColor: '#1976e6'}
                      : null,
                  ]}>
                  <Text style={styles.alertMessageButtonTextStyle}>
                    {this.props.positiveButtonText}
                  </Text>
                </TouchableOpacity>
              )}
              {this.props.displayNegativeButton && (
                <TouchableOpacity
                  onPress={this.onNegativeButtonPress}
                  style={styles.alertMessageButtonStyle}>
                  <Text style={styles.alertMessageButtonTextStyle}>
                    {this.props.negativeButtonText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

AlertCustom.propTypes = {
  displayAlert: PropTypes.bool,
  displayAlertIcon: PropTypes.bool,
  alertTitleText: PropTypes.string,
  alertMessageText: PropTypes.string,
  displayPositiveButton: PropTypes.bool,
  positiveButtonText: PropTypes.string,
  displayNegativeButton: PropTypes.bool,
  negativeButtonText: PropTypes.string,
  onPressPositiveButton: PropTypes.func,
  onPressNegativeButton: PropTypes.func,
};

// export default CustomAlertComponent;

const styles = StyleSheet.create({
  mainOuterComponent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000088',
  },
  mainContainer: {
    flexDirection: 'column',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#404040',
    // borderWidth: 2,
    // borderColor: '#FF0000',
    borderRadius: 10,
    padding: 4,
  },
  topPart: {
    flex: 0.5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#00FF00',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  middlePart: {
    flex: 1,
    width: '100%',
    padding: 4,
    color: '#FFFFFF',
    fontSize: 16,
    marginVertical: 2,
  },
  bottomPart: {
    flex: 0.5,
    width: '100%',
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-evenly',
  },
  alertIconStyle: {
    height: 35,
    width: 35,
  },
  alertTitleTextStyle: {
    flex: 1,
    textAlign: 'justify',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 2,
    marginHorizontal: 9,
  },
  alertMessageTextStyle: {
    flex: 1,
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
    fontSize: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  alertMessageButtonStyle: {
    width: '30%',
    paddingHorizontal: 6,
    marginVertical: 4,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertMessageButtonTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

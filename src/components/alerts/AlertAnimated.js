/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Modal, View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import LottieView from 'lottie-react-native';
import Space from '../layout/Space';

export default class AlertAnimated extends React.Component {
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
                ? {height: '60%'}
                : {height: '45%'},
            ]}>
            {/* First ROw - Alert Icon and Title */}
            <View style={styles.topPart}>
              <Text style={styles.alertTitleTextStyle}>
                {`${this.props.alertTitleText}`}
              </Text>
            </View>
            {/* Second Row - Alert Message Text */}
            <View style={styles.middlePart}>
              <LottieView
                source={require('../animations/done.json')}
                autoPlay
                loop={false}
                style={styles.animIcon}
              />
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
                      : null || this.props.alertTitleText === 'Félicitation !'
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

AlertAnimated.propTypes = {
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
    flex: 0.2,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#00FF00',
    paddingHorizontal: 9,
    marginTop: 12,
  },
  middlePart: {
    flex: 1,
    width: '100%',
    // borderWidth: 1,
    // borderColor: '#FF6600',
    padding: 4,
    color: '#FFFFFF',
    fontSize: 16,
    marginVertical: 2,
  },
  bottomPart: {
    flex: 0.2,
    width: '100%',
    // borderWidth: 1,
    // borderColor: '#0066FF',
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-evenly',
  },
  alertIconStyle: {
    // borderWidth: 1,
    // borderColor: '#cc00cc',
    height: 35,
    width: 35,
  },
  alertTitleTextStyle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    // borderWidth: 1,
    // borderColor: '#660066',
    marginHorizontal: 9,
  },
  alertMessageTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.3,
    fontSize: 18,
    paddingHorizontal: 18,
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
  animIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'relative',
    height: 600,
    width: 600,
  },
});

/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';

import Space from '../layout/Space';
import {secondColor} from '../config/color';

import {connect} from 'react-redux';
import { appName } from '../../config/utils';
import { SafeAreaView } from 'react-native-safe-area-context';

class TitleApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNavigationEnabled: this.props.isNavigationEnabled
        ? this.props.isNavigationEnabled
        : false,
      onlyTitleApp: this.props.onlyTitleApp ? true : false,
      indexPage: this.props.indexPage ? this.props.indexPage : 0,
    };
  }

  //SWIPE PAGE
  UNSAFE_componentWillReceiveProps(props) {
    if (this.props.indexTitle !== undefined) {
      this.setState({indexPage: this.props.indexTitle});
    }
  }

  //APPUI SUR TAB
  swipePage(buttonRef) {
    if (buttonRef === 'first') {
      const swipeAction = {type: 'TOGGLE_PAGE', value: 0};
      this.props.dispatch(swipeAction);
    } else if (buttonRef === 'second') {
      const swipeAction = {type: 'TOGGLE_PAGE', value: 1};
      this.props.dispatch(swipeAction);
    }
  }

  render() {
    const state = this.state;
    return (
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? 9 : null,
          width: '100%',
        }}>
        {state.onlyTitleApp ? (
          <Text style={[styles.text]}> {appName} </Text>
        ) : (
          <>
            <Text style={[styles.text]}>Bienvenue sur</Text>
            <Text style={[styles.text]}>{appName}</Text>
          </>
        )}

        <Space size={15} />

        {state.isNavigationEnabled ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <TouchableOpacity
              disabled={state.indexPage === 0 ? true : false}
              onPress={this.swipePage.bind(this, 'first')}
              activeOpacity={0.6}
              style={{
                flex: 1,
                width: '100%',
              }}>
              <Text
                style={[
                  styles.textButton,
                  {
                    fontWeight: state.indexPage === 0 ? 'bold' : '300',
                    color: state.indexPage === 0 ? secondColor : 'lightgray',
                  },
                ]}>
                Connexion
              </Text>
              {state.indexPage === 0 ? (
                <View
                  style={{
                    height: 3,
                    backgroundColor: secondColor,
                    width: '100%',
                    alignSelf: 'center',
                  }}
                />
              ) : null}
            </TouchableOpacity>

            <Space width={Platform.OS === 'android' ? '12.5%' : '6%'} />
            <View style={{width: 1, backgroundColor: 'lightgray'}} />
            <Space width={Platform.OS === 'android' ? '12.5%' : '6%'} />

            <TouchableOpacity
              disabled={state.indexPage === 1 ? true : false}
              onPress={this.swipePage.bind(this, 'second')}
              activeOpacity={0.6}
              style={{
                flex: 1,
                width: '100%',
              }}>
              <Text
                style={[
                  styles.textButton,
                  {
                    fontWeight: state.indexPage === 1 ? 'bold' : '300',
                    color: state.indexPage === 1 ? secondColor : 'lightgray',
                  },
                ]}>
                Inscription
              </Text>
              {state.indexPage === 1 ? (
                <View
                  style={{
                    height: 3,
                    backgroundColor: secondColor,
                    width: '100%',
                    alignSelf: 'center',
                  }}
                />
              ) : null}
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

const isFlexIOS = Platform.OS === 'ios' ? 1 : null;

const styles = StyleSheet.create({
  text: {
    flex: isFlexIOS,
    textAlign: 'center',
    letterSpacing: 1,
    fontSize: 25,
    width: '100%',
    fontWeight: 'bold',
    color: '#1470b9',
    //color: secondColor,
  },
  textButton: {
    alignSelf: 'center',
    textAlign: 'center',
    flex: 1,
    width: '100%',
    fontSize: 25,
    fontWeight: 'bold',
    color: secondColor,
    marginBottom: 6,
  },
});

const mapStateToProps = state => {
  return state.togglePage;
};

export default connect(mapStateToProps)(TitleApp);

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {StyleSheet, Text, View, ScrollView, Dimensions} from 'react-native';
import bcrypt from 'react-native-bcrypt';

//LAYOUTS
import * as Color from '../../components/config/color';
import Container from '../../components/layout/Container';
import Space from '../../components/layout/Space';
import ButtonLarge from '../../components/buttons/ButtonLarge';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

//ICON
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faExclamationTriangle, faLock} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../i18n/i18n';
import {API_URL} from '../../config/utils';
import InputText from '../../components/inputs/InputText';

class ForgotNewPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: '',
      password: null,
      passwordConfirm: null,
      passWrong: null,
      passConfirmWrong: null,
      loading: false,
      code: this.props.navigation.state.params.code
        ? this.props.navigation.state.params.code
        : null,
    };
  }

  async setNewPassword() {
    this.setState({loading: true});
    if (
      this.state.passWrong ||
      this.state.passConfirmWrong ||
      !this.state.code ||
      !this.state.password ||
      !this.state.passwordConfirm
    ) {
      this.setState({
        errorMsg: 'Votre mot de passe est incorrect ou incomplet.',
      });
      return;
    }

    const salt = bcrypt.genSaltSync(2);
    let passEnc = bcrypt.hashSync(this.state.password, salt);

    let result = await fetch(API_URL + '/reset/password', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: this.state.code,
        password: passEnc,
      }),
    }).then(async function (response) {
      return response;
    });
    if (result.status === 200 && result.ok) {
      this.props.navigation.navigate('Start');
    } else {
      this.setState({
        errorMsg:
          'Une erreur est survenue. Veuillez réessayer ou contacter le support.',
      });
    }
    this.setState({loading: false});
    return;
  }

  onPasswordChange(value) {
    this.setState({password: value});
    if (value === '' || value === ' ' || value == null) {
      this.setState({passWrong: true});
    } else {
      this.setState({passWrong: false});
    }
  }

  onPasswordConfirmChange(value) {
    this.setState({passwordConfirm: value});
    if (this.state.password === value) {
      this.setState({passConfirmWrong: false});
    } else {
      this.setState({passConfirmWrong: true});
    }
  }

  render() {
    const state = this.state;
    let smallScreen;
    let heightScreen = Dimensions.get('window').height;
    heightScreen / 2 < 300 ? (smallScreen = true) : false;
    return (
      <KeyboardAwareScrollView
        scrollEnabled={true}
        keyboardOpeningTime={0}
        viewIsInsideTabBar={true}
        extraScrollHeight={
          smallScreen ? heightScreen / 2.7 - 80 : heightScreen / 2 - 110
        }
        enableAutomaticScroll={true}
        ref={ref => {
          this.scroll = ref;
        }}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        style={{backgroundColor: 'white'}}>
        <Space size={30} />
        <View
          style={{
            justifyContent: 'center',
            height: 210,
            width: '90%',
            borderColor: 'lightgrey',
            borderWidth: 1,
            borderRadius: 30,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              padding: 15,
              borderColor: 'lightgrey',
              borderRadius: 60,
              borderWidth: 6,
            }}>
            <FontAwesomeIcon icon={faLock} color={'black'} size={45} />
          </View>
          <Space size={30} />
          <Text
            style={{
              textAlign: 'center',
              color: 'black',
              paddingHorizontal: '9%',
              fontSize: 15,
            }}>
            Saisissez votre nouveau mot de passe ci-dessous.
          </Text>
        </View>
        <Space size={30} />
        <InputText
          style={{height: 20, alignSelf: 'center', width: '95%'}}
          placeholder={'Nouveau mot de passe *'}
          isPassword={true}
          content={state.password}
          wrong={state.passWrong}
          onValueChange={value => this.onPasswordChange(value)}
        />
        <Space size={30} />
        <InputText
          style={{height: 20, alignSelf: 'center', width: '95%'}}
          placeholder={'Confirmer le mot de passe *'}
          isPassword={true}
          content={state.passwordConfirm}
          wrong={state.passConfirmWrong}
          onValueChange={value => this.onPasswordConfirmChange(value)}
        />
        <Space size={30} />
        <ButtonLarge
          loading={state.loading}
          title={'Confirmer'}
          onPress={this.setNewPassword.bind(this)}
        />
        <Space size={30} />
        {state.errorMsg ? (
          <View style={styles.alertError}>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              size={30}
              color={'black'}
            />
            <Text style={{color: 'black', marginLeft: 12}}>
              {state.errorMsg}
            </Text>
          </View>
        ) : null}
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 19,
    justifyContent: 'center',
    maxWidth: '100%',
    textAlign: 'center',
    color: Color.secondColor,
  },
  alertError: {
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

export default ForgotNewPassword;

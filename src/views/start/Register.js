/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {ScrollView, Text, Platform, Dimensions} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';

//LAYOUTS
import Container from '../../components/layout/Container';
import Space from '../../components/layout/Space';
import ButtonLarge from '../../components/buttons/ButtonLarge';
import InputText from '../../components/inputs/InputText';
import bcrypt from 'react-native-bcrypt';

//CONSTANTS
import I18n from '../../i18n/i18n';
import {getModel} from 'react-native-device-info';
import {API_URL, versionApp} from '../../config/utils';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* METTRE SUR NULL APRES */
      nom: '',
      prenom: '',
      mail: '',
      tel: '',
      password: '',
      confirmPassword: '',
      /* CONFIRM FIELDS STATES */
      nomIsWrong: null,
      prenomIsWrong: null,
      mailIsWrong: null,
      telIsWrong: null,
      passIsWrong: null,
      isConfPassWrong: null,
    };
  }

  onNomChange(value) {
    this.setState({nom: value});
    if (value === '' || value === ' ' || value == null) {
      this.setState({nomIsWrong: true});
    } else {
      this.setState({nomIsWrong: false});
    }
  }

  onPrenomChange(value) {
    this.setState({prenom: value});
    if (value === '' || value === ' ' || value == null) {
      this.setState({prenomIsWrong: true});
    } else {
      this.setState({prenomIsWrong: false});
    }
  }

  onMailChange(value) {
    this.setState({mail: value});
    if (value === '' || value === ' ' || value == null) {
      this.setState({mailIsWrong: true});
    } else {
      this.setState({mailIsWrong: false});
    }
  }

  onTelChange(value) {
    this.setState({tel: value});
    if (value === '' || value === ' ' || value == null) {
      this.setState({telIsWrong: true});
    } else {
      this.setState({telIsWrong: false});
    }
  }

  onPassChange(value) {
    this.setState({password: value});
    if (value === '' || value === ' ' || value == null) {
      this.setState({passIsWrong: true});
    } else {
      this.setState({passIsWrong: false});
    }
  }

  OnConfirmPassChange(value) {
    this.setState({confirmPassword: value});
    if (this.state.password === value) {
      this.setState({isConfPassWrong: false});
    } else {
      this.setState({isConfPassWrong: true});
    }
  }

  async signUp() {
    this.setState({errorMsg: null});
    const state = this.state;

    //Checks inputs
    if (
      !state.prenom ||
      !state.nom ||
      !state.password ||
      !state.confirmPassword ||
      !state.mail
    ) {
      this.setState({
        errorMsg: "Veuillez remplir le formulaire d'inscription.",
      });
      return false;
    }

    if (state.password !== state.confirmPassword) {
      this.setState({
        errorMsg: 'Vérifiez la confirmation de votre mot de passe.',
      });
      return false;
    }

    if (state.password.length <= 5) {
      this.setState({
        errorMsg:
          'Veuillez utiliser un mot de passe contenant minimum 6 charactères.',
      });
      return false;
    }

    //Pass hash & devices Infos
    const salt = bcrypt.genSaltSync(2);
    let passEnc = bcrypt.hashSync(state.password, salt);
    let model_device = getModel();
    let version_device = null;

    if (Platform.OS === 'android') {
      version_device = Platform.constants.Release.substring(0, 2);
    } else {
      version_device = Platform.constants.osVersion.substring(0, 2);
    }

    //Ts de sign up
    let tsCreate = new Date();
    tsCreate.setHours(tsCreate.getHours() + 2);
    tsCreate = tsCreate.toISOString().slice(0, 19).replace('T', ' ');

    //Query signup
    let result = await fetch(API_URL + '/api/clients', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: state.nom,
        firstname: state.prenom,
        email: state.mail,
        password: passEnc,
        modelDev: model_device,
        osDev: Platform.OS,
        versionDev: version_device,
        versionApp: versionApp,
        tsCreate: tsCreate,
      }),
    })
      .then(res => res.json())
      .then(async function (resJson) {
        return resJson;
      })
      .catch(err => {
        console.log('ERROR', err);
        return false;
      });

    let defaultError = null;

    if (result === false) {
      defaultError = 'Une erreur est survenue. Veuillez réessayer.';
    } else if (result.code) {
      result.code === 401 ? (defaultError = 'Identifiants invalides.') : null;
    } else if (result.detail) {
      result.detail.includes("for key 'email'")
        ? (defaultError = 'Cette adresse mail est déjà utilisée.')
        : null;
    } else if (
      result.email === state.mail &&
      result.name === state.nom &&
      result.firstname === state.prenom
    ) {
      await this.logUser();
    }
    this.setState({errorMsg: defaultError});
    return;
  }

  async logUser() {
    if (!this.state.mail || !this.state.password) {
      this.setState({
        errorMsg: 'La connexion à échoué. Veuillez réessayer manuellement.',
      });
      return;
    }

    let result = await fetch(API_URL + '/authentication_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.mail,
        password: this.state.password,
      }),
    })
      .then(res => res.json())
      .then(async function (resJson) {
        if (resJson.token) {
          await AsyncStorage.setItem('id_token', resJson.token);
          await AsyncStorage.setItem('refresh_token', resJson.refresh_token);
          return true;
        }

        if (resJson.code) {
          console.log('[ERROR]', resJson.message);
          return resJson.code;
        }

        return;
      })
      .catch(err => {
        console.log('ERROR', err);
        return false;
      });

    if (result === false) {
      this.setState({errorMsg: 'Une erreur est survenue. Veuillez réessayer.'});
    } else if (result === 401) {
      this.setState({
        errorMsg:
          'Identifiants invalides. Réessayez la connexion manuellement.',
      });
    } else if (result === true) {
      await this.retrieveUser();
    }
    return;
  }

  async retrieveUser() {
    const JWT_TOKEN = await AsyncStorage.getItem('id_token');

    let user = await fetch(API_URL + '/api/clients?email=' + this.state.mail, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JWT_TOKEN,
      },
    })
      .then(res => res.json())
      .then(async function (result) {
        user = result[0];
        return user;
      });

    if (user.email === this.state.mail) {
      await AsyncStorage.setItem('user_profile', JSON.stringify(user));
      this.props.navigation.navigate('SuccessSignUp');
    } else {
      this.setState({
        errorMsg:
          'Identifiants invalides. Réessayez la connexion manuellement.',
      });
    }
  }

  render() {
    let smallScreen;
    let heightScreen = Dimensions.get('window').height;
    heightScreen / 2 < 300 ? (smallScreen = true) : false;
    return (
      <KeyboardAwareScrollView
        scrollEnabled={Platform.OS === 'ios' ? true : true}
        keyboardOpeningTime={0}
        viewIsInsideTabBar={true}
        enableOnAndroid={false}
        extraScrollHeight={
          smallScreen ? heightScreen / 2.1 - 80 : heightScreen / 2 - 80
        }
        enableAutomaticScroll={true}
        ref={ref => {
          this.scroll = ref;
        }}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        style={{backgroundColor: 'white'}}>
        <Space size={30} />

        <InputText
          value={this.state.nom}
          wrong={this.state.nomIsWrong}
          onValueChange={nom => this.onNomChange(nom)}
          placeholder={I18n.t('register_last_name') + ' *'}
        />

        <Space size={21} />

        <InputText
          value={this.state.prenom}
          wrong={this.state.prenomIsWrong}
          onValueChange={nom => this.onPrenomChange(nom)}
          placeholder={I18n.t('register_first_name') + ' *'}
        />

        <Space size={21} />

        <InputText
          value={this.state.mail}
          wrong={this.state.mailIsWrong}
          isMailInput={true}
          onValueChange={nom => this.onMailChange(nom)}
          placeholder={I18n.t('register_mail') + ' *'}
        />

        <Space size={21} />

        {/*         NUMERO DE TELEPHONE
              <InputText
                value={this.state.tel}
                wrong={this.state.telIsWrong}
                onValueChange={(nom) => this.onTelChange(nom) }
                placeholder={I18n.t('register_tel') + ' *'} isNumberInput={true} />

              <Space size={21} /> */}

        <InputText
          value={this.state.password}
          wrong={this.state.passIsWrong}
          onValueChange={nom => this.onPassChange(nom)}
          placeholder={I18n.t('register_password') + ' *'}
          isPassword={true}
        />

        <Space size={21} />

        <InputText
          value={this.state.confirmPassword}
          onValueChange={nom => this.OnConfirmPassChange(nom)}
          wrong={this.state.isConfPassWrong}
          placeholder={I18n.t('register_password_confirm') + ' *'}
          isPassword={true}
        />

        <Space size={18} />

        {this.state.errorMsg ? (
          <>
            <Text
              style={{
                fontWeight: '300',
                color: 'red',
                fontSize: 15,
                alignSelf: 'flex-start',
                marginLeft: 30,
              }}>
              {this.state.errorMsg}
            </Text>
          </>
        ) : null}

        <Space size={18} />

        <ButtonLarge
          onPress={() => this.signUp()}
          title={I18n.t('register_valid_btn')}
        />

        <Space size={21} />
      </KeyboardAwareScrollView>
    );
  }
}

export default Register;

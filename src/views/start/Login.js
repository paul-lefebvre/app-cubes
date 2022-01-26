/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {API_URL} from '../../config/utils';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

//LAYOUTS
import * as Color from '../../components/config/color';
import Space from '../../components/layout/Space';
import InputText from '../../components/inputs/InputText';
import ButtonLarge from '../../components/buttons/ButtonLarge';

//ICONS
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../i18n/i18n';
import {versionApp} from '../../config/utils';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      mail: '',
      password: '',
      loading: false,
      isNetworkActive: null,
      errorMsg: null,
    };
  }

  // VERIFY INTERNET
  async componentDidMount() {
    this._isMounted = true;
    NetInfo.fetch().then(state => {
      if (this._isMounted) {
        this.setState({isNetworkActive: state.isConnected});
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onMailChange(value) {
    this.setState({mail: value});
  }

  onPassChange(value) {
    this.setState({password: value});
  }

  async logUser() {
    if (!this.state.mail || !this.state.password) {
      this.setState({errorMsg: 'Veuillez remplir le formulaire de connexion.'});
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
        console.log('RESPONSE :', resJson);

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
        console.error(err);
        return false;
      });

    if (result === false) {
      this.setState({errorMsg: 'Une erreur est survenue. Veuillez réessayer.'});
    } else if (result === 401) {
      this.setState({errorMsg: 'Identifiants invalides.'});
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
        return result[0];
      });

    if (user.email === this.state.mail) {
      await AsyncStorage.setItem('user_profile', JSON.stringify(user));
      this.props.navigation.navigate('Home');
    } else {
      this.setState({
        errorMsg:
          'Identifiants invalides. Réessayez la connexion manuellement.',
      });
    }
  }

  goToForgotPass() {
    this.props.navigation.navigate('ForgotPassword');
  }

  render() {
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
        <Text style={styles.text}>{I18n.t('login_explain')}</Text>
        <Space size={30} />
        <InputText
          placeholder={I18n.t('login_mail') + ' *'}
          style={{height: 20}}
          isMailInput={true}
          onValueChange={mail => this.onMailChange(mail)}
          content={this.state.mail}
        />
        <Space size={21} />
        <InputText
          placeholder={I18n.t('login_password') + ' *'}
          onValueChange={pass => this.onPassChange(pass)}
          isPassword={true}
        />
        <Space size={30} />

        <TouchableOpacity
          style={styles.forgetPassText}
          onPress={this.goToForgotPass.bind(this)}>
          <Text style={{textDecorationLine: 'underline'}}>
            {I18n.t('login_forget_pass')}
          </Text>
        </TouchableOpacity>

        {this.state.errorMsg ? (
          <>
            <Space size={21} />
            <Text
              style={{
                fontWeight: '300',
                color: 'red',
                fontSize: 18,
                alignSelf: 'flex-start',
                marginLeft: 30,
              }}>
              {this.state.errorMsg}
            </Text>
          </>
        ) : null}

        <Space size={21} />

        <ButtonLarge
          onPress={() => this.logUser()}
          title={I18n.t('login_valid_btn')}
        />

        <Space size={18} />

        <Text style={{textAlign: 'center'}}>
          {I18n.t('demo_version_app')} {versionApp}
        </Text>

        <Space size={30} />

        {!this.state.isNetworkActive ? (
          <View style={styles.infoNetwork}>
            <FontAwesomeIcon icon={faInfoCircle} size={30} color={'black'} />
            <Text style={{color: 'black', marginLeft: 12}}>
              Veuillez accéder à une connexion Internet afin de vous connecter.
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
    paddingHorizontal: 3,
    textAlign: 'center',
    color: Color.secondColor,
  },
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
  loader: {
    flex: 1,
    width: 21,
    height: 21,
    opacity: 1,
    color: 'black',
  },
  forgetPassText: {
    marginRight: '5%',
    alignSelf: 'center',
  },
});

export default Login;

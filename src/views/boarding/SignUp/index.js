/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import styles from './style';
import {NeomorphFlex} from 'react-native-neomorph-shadows';

//PACKAGES
import Swiper from 'react-native-swiper';

//FCTs
import register from '../../../functions/register';
import login from '../../../functions/login';

//LAYOUTS
import * as Color from '../../../components/config/color';
import Container from '../../../components/layout/Container';
import ButtonLarge from '../../../components/buttons/ButtonLarge';
import Space from '../../../components/layout/Space';
import InputText from '../../../components/inputs/InputText';

//CONSTANTS
import I18n from '../../../i18n/i18n';
import {appName} from '../../../config/utils';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.swiper = React.createRef();
    this.state = {
      errorMsg: null,
      mail: '',
      wrongMail: null,
      password: '',
      wrongPassword: null,
      confirmPassword: '',
      wrongConfirmPassword: null,
      indexCard: this.props.navigation.state.params.indexPage
        ? this.props.navigation.state.params.indexPage
        : 0,
    };
  }

  refreshIndexTop(index) {
    this.setState({indexCard: index});
  }

  tapOnIndex(index) {
    this.swiper.current.scrollTo(index, true);
  }

  updateMail(value) {
    this.setState({mail: value});
    if (
      !value ||
      value === '' ||
      value.includes(' ') ||
      !value.includes('@') ||
      !value.includes('.')
    ) {
      this.setState({wrongMail: true});
    } else {
      this.setState({wrongMail: false});
    }
  }

  updatePassword(value) {
    this.setState({password: value});
    if (value === '' || value === ' ' || value == null) {
      this.setState({wrongPassword: true});
    } else {
      this.setState({wrongPassword: false});
    }
  }

  updateConfirmPassword(value) {
    this.setState({confirmPassword: value});
    if (this.state.password === value) {
      this.setState({wrongConfirmPassword: false});
    } else {
      this.setState({wrongConfirmPassword: true});
    }
  }

  /**
   *    LOGIN CARD
   */
  renderLoginCard() {
    const state = this.state;
    return (
      <NeomorphFlex
        useArt
        style={styles.cardContainer}
        darkShadowColor="#FFFFFF"
        lightShadowColor="#D1CDC7">
        <Space size={21} />
        <InputText
          onValueChange={mail => {
            this.updateMail(mail);
          }}
          placeholder={'Email'}
          content={state.mail}
          isMailInput
        />
        <InputText
          onValueChange={pass => {
            this.updatePassword(pass);
          }}
          placeholder={'Mot de passe'}
          content={state.password}
          isPassword
        />
        <TouchableOpacity onPress={() => null} activeOpacity={0.3}>
          <Text style={{textDecorationLine: 'underline'}}>
            Mot de passe oublié ?
          </Text>
        </TouchableOpacity>
        <Space size={12} />
        <Text style={styles.errorMsg}>
          {this.state.errorMsg ? this.state.errorMsg : ''}
        </Text>
      </NeomorphFlex>
    );
  }

  /**
   *    SIGN UP CARD
   */
  renderSignupCard() {
    const state = this.state;
    return (
      <NeomorphFlex
        useArt
        style={styles.cardContainer}
        darkShadowColor="#FFFFFF"
        lightShadowColor="#D1CDC7">
        <Space size={30} />
        <InputText
          onValueChange={mail => {
            this.updateMail(mail);
          }}
          placeholder={'Email'}
          content={state.mail}
          isMailInput
          wrong={state.wrongMail}
        />
        <InputText
          onValueChange={pass => {
            this.updatePassword(pass);
          }}
          placeholder={'Mot de passe'}
          content={state.password}
          isPassword
          wrong={state.wrongPassword}
        />
        <InputText
          onValueChange={pass => {
            this.updateConfirmPassword(pass);
          }}
          placeholder={'Confirmer mot de passe'}
          content={state.confirmPassword}
          wrong={state.wrongConfirmPassword}
          isPassword
        />
      </NeomorphFlex>
    );
  }

  /**
   *    NEXT STEP
   */
  async nextStep() {
    if (this.state.indexCard === 1) {
      const firstname = this.props.navigation.state.params.firstname;
      const lastname = this.props.navigation.state.params.lastname;
      const user = {
        pseudo: 'pseudoTest',
        firstname: firstname ? firstname : '',
        lastname: lastname ? lastname : '',
        mail: this.state.mail,
        password: this.state.password,
      };
      const response = await register(user);
      console.log(response);
    } else if (this.state.indexCard === 0) {
      const credentials = {
        mail: this.state.mail,
        password: this.state.password,
      };
      const response = await login(credentials);
      if (response.error) {
        this.setState({errorMsg: response.message});
      } else {
        this.props.navigation.navigate('Home');
      }
    }
  }

  render() {
    const state = this.state;
    let heightScreen = Dimensions.get('window').height;
    let widthScreen = Dimensions.get('window').width;
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={-heightScreen / 2.5}
        style={styles.container}
        behavior="height">
        <Container
          backgroundColor={Color.colorBackground}
          justifyContent={'flex-start'}
          alignItems={'center'}>
          <Space size={60} />
          <View style={styles.headerContainer}>
            <Image
              style={{
                flex: 0.45,
                alignItems: 'center',
                resizeMode: 'contain',
                zIndex: 1,
              }}
              source={require('../../../assets/img/logo.png')}
            />
            <Text style={styles.appName}>{appName}</Text>
          </View>
          <Space size={18} />
          <View style={styles.indexBtnContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.tapOnIndex(0)}
              style={styles.indexBtn}>
              <Text
                style={[
                  styles.indexText,
                  {color: state.indexCard === 0 ? 'white' : 'lightgrey'},
                ]}>
                SE CONNECTER
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.tapOnIndex(1)}
              style={styles.indexBtn}>
              <Text
                style={[
                  styles.indexText,
                  {color: state.indexCard === 1 ? 'white' : 'lightgrey'},
                ]}>
                INSCRIPTION
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.whiteLine} />
          <Space size={18} />
          <View style={styles.backgroundPage} />
          <Swiper
            ref={this.swiper}
            index={state.indexCard}
            onIndexChanged={index => {
              this.refreshIndexTop(index);
            }}
            loop={false}
            showsPagination={false}
            width={widthScreen}
            containerStyle={{
              flex: 0.6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.renderLoginCard()}
            {this.renderSignupCard()}
          </Swiper>

          <Space size={90} />
          <ButtonLarge
            style={{position: 'absolute', bottom: '9%'}}
            onPress={this.nextStep.bind(this)}
            title={'CONTINUER'}
          />
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

export default SignUp;

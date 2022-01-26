/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//LAYOUTS
import * as Color from '../../components/config/color';
import Container from '../../components/layout/Container';
import Space from '../../components/layout/Space';
import ButtonLarge from '../../components/buttons/ButtonLarge';

//ICON
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUnlockAlt} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../i18n/i18n';
import {API_URL} from '../../config/utils';
import InputText from '../../components/inputs/InputText';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: null,
      loading: false,
      mailWrong: null,
    };
  }

  async sendCode() {
    this.setState({loading: true});
    if (this.state.mailWrong === true || !this.state.mail) {
      this.setState({mailWrong: true});
      return;
    }
    let result = await fetch(API_URL + '/reset/request', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: this.state.mail,
      }),
    }).then(async function (response) {
      return response;
    });
    this.props.navigation.navigate('ForgotCodeReset');
    this.setState({loading: false});
    return;
  }

  onMailChange(value) {
    this.setState({mail: value});
    if (
      !value ||
      value === '' ||
      value.includes(' ') ||
      !value.includes('@') ||
      !value.includes('.')
    ) {
      this.setState({mailWrong: true});
    } else {
      this.setState({mailWrong: false});
    }
  }

  render() {
    const state = this.state;
    return (
      <Container justifyContent={'flex-start'} alignItems={'center'}>
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
            <FontAwesomeIcon icon={faUnlockAlt} color={'black'} size={45} />
          </View>
          <Space size={30} />
          <Text
            style={{
              textAlign: 'center',
              color: 'black',
              paddingHorizontal: '9%',
              fontSize: 15,
            }}>
            Vous avez oublié votre mot de passe ? Renseignez-votre adresse mail
            ci-dessous. Vous recevrez un code dans votre boîte de réception.
          </Text>
        </View>
        <Space size={30} />
        <InputText
          style={{height: 20, alignSelf: 'center', width: '95%'}}
          placeholder={'Votre adresse électronique *'}
          isMailInput={true}
          wrong={state.mailWrong}
          content={state.mail}
          onValueChange={mail => this.onMailChange(mail)}
        />
        <Space size={30} />
        <ButtonLarge
          loading={state.loading}
          title={'Confirmer'}
          onPress={this.sendCode.bind(this)}
        />
      </Container>
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
});

export default ForgotPassword;

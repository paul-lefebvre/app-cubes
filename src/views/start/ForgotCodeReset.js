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
import {faCheck, faGift, faUnlockAlt} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../i18n/i18n';
import {API_URL, appName, versionApp} from '../../config/utils';
import InputText from '../../components/inputs/InputText';

class ForgotCodeReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      loading: false,
      isWrongCode: null,
    };
  }

  async checkCode() {
    this.setState({loading: true});
    let result = await fetch(API_URL + '/reset/code', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: this.state.code,
      }),
    }).then(async function (response) {
      return response;
    });
    if (result.status === 200 && result.ok) {
      this.setState({isWrongCode: false});
      this.props.navigation.navigate('ForgotNewPassword', {
        code: this.state.code,
      });
    } else {
      this.setState({isWrongCode: true});
    }
    this.setState({loading: false});
    return;
  }

  onCodeChange(value) {
    this.setState({code: value});
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
            Veuillez entrer le code reçu sur votre boîte mail.
          </Text>
        </View>
        <Space size={30} />
        <InputText
          style={{height: 20, alignSelf: 'center', width: '95%'}}
          placeholder={'Code *'}
          content={state.code}
          isNumberInput={true}
          wrong={state.isWrongCode}
          onValueChange={code => this.onCodeChange(code)}
        />
        <Space size={30} />
        <ButtonLarge
          loading={state.loading}
          title={'Confirmer'}
          onPress={this.checkCode.bind(this)}
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

export default ForgotCodeReset;

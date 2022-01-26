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
import {faCheck, faGift} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../i18n/i18n';
import {appName, versionApp} from '../../config/utils';

class SuccessSignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
    };
  }

  async UNSAFE_componentWillMount() {
    let user = JSON.parse(await AsyncStorage.getItem('user_profile'));
    this.setState({user: user});
  }

  _goToHome() {
    this.props.navigation.navigate('Home');
  }

  render() {
    const state = this.state;
    return (
      <Container justifyContent={'center'} alignItems={'center'}>
        <Space size={30} />
        <View
          style={{flex: 1, justifyContent: 'center', width: '90%'}}
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              justifyContent: 'center',
              height: 210,
              width: '100%',
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
              <FontAwesomeIcon icon={faCheck} color={'lightgrey'} size={45} />
            </View>
            <Space size={30} />
            <Text
              style={{
                textAlign: 'center',
                color: 'black',
                paddingHorizontal: '9%',
                fontSize: 15,
              }}>
              Félicitation vous venez de créer votre compte sur {appName}
            </Text>
          </View>

          <Space size={30} />

          <FontAwesomeIcon
            style={{alignSelf: 'center'}}
            icon={faGift}
            color={'black'}
            size={90}
          />

          <Space size={30} />

          <Text style={styles.text}>
            {'Bonne nouvelle'} {state.user.firstname}{' '}
            {
              "! Nous vous offrons une utilisation gratuite de l'application lors de notre programme de tests !"
            }
          </Text>

          <Space size={30} />

          <ButtonLarge
            style={{width: '100%', justifyContent: 'center'}}
            onPress={() => this._goToHome()}
            title={'Commencer'}
          />

          <Space size={18} />
        </View>
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

export default SuccessSignUp;

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

//CONSTANTS
import {API_URL, appName} from '../../../config/utils';

//LAYOUTS
import * as Color from '../../../components/config/color';
import Container from '../../../components/layout/Container';
import ButtonLarge from '../../../components/buttons/ButtonLarge';

import Space from '../../../components/layout/Space';

//ICON
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {faPlusSquare} from '@fortawesome/free-regular-svg-icons';

//PACKAGES
import I18n from '../../../i18n/i18n';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-community/async-storage';
import Avatar from '../../../components/avatar/Avatar';

class Profil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
    };
  }

  async componentWillMount() {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    this.setState({
      user: user,
    });
    console.log(user);
  }

  headerRender() {
    const state = this.state;
    return (
      <View style={styles.header}>
        <Text style={styles.pseudo}>{state.user ? state.user.pseudo : ''}</Text>
        <TouchableOpacity
          onPress={() => null}
          style={styles.button}
          activeOpacity={0.6}>
          <FontAwesomeIcon icon={faPlusSquare} size={27} color={'white'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => null}
          style={styles.button}
          activeOpacity={0.6}>
          <FontAwesomeIcon icon={faBars} size={27} color={'white'} />
        </TouchableOpacity>
      </View>
    );
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
        {this.headerRender()}
        <Container
          backgroundColor={Color.colorBackground}
          justifyContent={'flex-start'}
          alignItems={'center'}>
          <Space size={30} />
          <View style={styles.profilContainer}>
            <Space width={9} />
            <Avatar
              url={
                API_URL +
                '/public/upload/images/avatar/' +
                state.user.avatar_img
              }
              style={{width: 81, height: 81}}
              styleImg={{width: 81, height: 81}}
            />
            <View style={styles.statContainer}>
              <Text style={styles.numbers}>0</Text>
              <Text style={styles.smallText}>Publications</Text>
            </View>

            <View style={styles.statContainer}>
              <Text style={styles.numbers}>
                {state.user ? state.user.abonnements.length : '?'}
              </Text>
              <Text style={styles.smallText}>Abonnements</Text>
            </View>
            <View style={styles.statContainer}>
              <Text style={styles.numbers}>
                {state.user ? state.user.abonnes.length : '?'}
              </Text>
              <Text textBreakStrategy="highQuality" style={styles.smallText}>
                Abonnés
              </Text>
            </View>
          </View>

          <Space size={30} />
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

export default Profil;

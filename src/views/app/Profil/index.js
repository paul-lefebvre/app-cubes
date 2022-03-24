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
import {appName} from '../../../config/utils';

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
          <Space size={60} />
          <View style={styles.headerContainer}>
            <Text style={styles.appName}>{appName}</Text>
          </View>
          <View style={styles.whiteLine} />
          <Space size={18} />
          <View style={styles.backgroundPage} />

          <Space size={90} />
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

export default Profil;

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

//PACKAGES
import Swiper from 'react-native-swiper';

//LAYOUTS
import * as Color from '../../../components/config/color';
import Container from '../../../components/layout/Container';
import ButtonLarge from '../../../components/buttons/ButtonLarge';

import Space from '../../../components/layout/Space';
import InputText from '../../../components/inputs/InputText';

//ICON
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../../i18n/i18n';
import {appName} from '../../../config/utils';

class Profil extends React.Component {
  constructor(props) {
    super(props);
    this.swiper = React.createRef();
    this.state = {};
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

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  TouchableHighlight,
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';
import styles from './style';

import Swiper from 'react-native-swiper';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';

//LAYOUTS
import * as Color from '../../../components/config/color';
import Container from '../../../components/layout/Container';

//ICON
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../../i18n/i18n';
import {appName} from '../../../config/utils';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    if (user) {
      this.props.navigation.navigate('Home');
    }
    SplashScreen.hide();
  }

  render() {
    const state = this.state;
    return (
      <Container justifyContent={'flex-start'} alignItems={'center'}>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => null}
          style={styles.skipBtn}>
          <Text
            style={styles.textSkipBtn}
            onPress={() => {
              this.props.navigation.navigate('SignUpPage', {indexPage: 0});
            }}>
            SE CONNECTER
          </Text>
        </TouchableOpacity>
        <Swiper
          loop
          width={360}
          dotColor={'lightgrey'}
          activeDotColor={'white'}
          paginationStyle={styles.paginationStyle}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image
              style={styles.imgSlider}
              source={require('../../../assets/img/boarding/welcome1.png')}
            />
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image
              style={styles.imgSlider}
              source={require('../../../assets/img/boarding/welcome2.png')}
            />
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image
              style={styles.imgSlider}
              source={require('../../../assets/img/boarding/welcome3.png')}
            />
          </View>
        </Swiper>
        <View style={styles.titleContainer}>
          <Text style={styles.subtitleText}>{appName}</Text>
          <View style={styles.lineSeparator} />
          <Text style={styles.titleText}>BIENVENUE CITOYEN.NE</Text>
        </View>

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor={Color.darkMagenta}
          onPress={() => this.props.navigation.navigate('DiscoverPage')}
          style={styles.buttonStart}>
          <>
            <Text style={styles.btnText}>DÉMARRER</Text>
            <FontAwesomeIcon icon={faArrowRight} color={'white'} size={30} />
          </>
        </TouchableHighlight>
      </Container>
    );
  }
}

export default Welcome;

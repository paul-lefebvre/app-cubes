/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {Text, View, StyleSheet, ScrollView, Dimensions} from 'react-native';

//UPLOADS
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';

//LAYOUTS
import Container from '../../components/layout/Container';
import Space from '../../components/layout/Space';
import Infos from '../../components/infos/Infos';
import ButtonLarge from '../../components/buttons/ButtonLarge';

//ICON
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../i18n/i18n';
import * as Color from '../../components/config/color';
import {API_URL} from '../../config/utils';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      errorMsg: null,
    };
  }

  async goToScanner() {
    try {
      this.props.navigation.state.params.scanner.enable();
      this.props.navigation.state.params.scanner.reactivate();
    } catch (err) {
      //console.log('ERROR :', err);
    }

    this.setState({errorMsg: ''});
    let haveInternet = await NetInfo.fetch().then(value => {
      return value.isConnected;
    });
    let offlineToken = await AsyncStorage.getItem('offline_token');

    if (!haveInternet && offlineToken <= 0) {
      this.setState({
        errorMsg:
          "Vous n'avez plus de jetons de charge hors-ligne.\n" +
          'Veuillez accéder à Internet pour obtenir de nouveaux jetons.',
      });
      return false;
    } else {
      this.props.navigation.navigate('Bluetooth');
    }
  }

  render() {
    const state = this.state;
    return (
      <Container justifyContent={'flex-start'} alignItems={'center'}>
        <Space size={30} />
        <View
          style={{
            flex: 0.35,
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
              borderColor: Color.secondColor,
              borderRadius: 60,
              borderWidth: 6,
            }}>
            <FontAwesomeIcon
              icon={faHome}
              color={Color.secondColor}
              size={45}
            />
          </View>
          <Space size={30} />
          <Text style={styles.titleHome}>{I18n.t('home_title')}</Text>
        </View>

        {this.state.errorMsg ? (
          <Infos
            style={{
              position: 'absolute',
              bottom: 120,
              marginTop: 30,
            }}
            displayInfos={true}
            isAnError={true}
            text={this.state.errorMsg}
          />
        ) : null}

        <ButtonLarge
          style={styles.buttonLarge}
          onPress={() => this.goToScanner()}
          title={I18n.t('home_scan_borne')}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  titleHome: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
  },
  buttonLarge: {
    bottom: 30,
    position: 'absolute',
  },
});

export default Home;

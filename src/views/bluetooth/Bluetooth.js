/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import {
  PermissionsAndroid,
  Platform,
  View,
  Text,
  StyleSheet,
} from 'react-native';

//BLUETOOTH
import {BleManager} from 'react-native-ble-plx';
import Geolocation from 'react-native-geolocation-service';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

//LAYOUTS
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Container from '../../components/layout/Container';
import Space from '../../components/layout/Space';

//CONSTANTS
import I18n from '../../i18n/i18n';

//DESIGN
import {faBluetoothB} from '@fortawesome/free-brands-svg-icons';
import ButtonLarge from '../../components/buttons/ButtonLarge';
import AsyncStorage from '@react-native-community/async-storage';

class Bluetooth extends React.Component {
  constructor() {
    super();
    this.manager = new BleManager();
    this.state = {
      borne: null,
      paired: false,
      connected: false,
      BtEnabled: false,
      errorMsg: null,
      locateService: null,
      buttonTitle: 'Continuer',
    };
  }

  async componentDidMount() {
    await this.startRequests();
  }

  /*=================================================================
  *
  *                         START & GEOLOCATION
  *
  =================================================================*/
  async startRequests() {
    let borne = {
      pseudo: '2076',
      name: 'AA10002076',
      address: '88:25:83:F3:0E:BF',
      paired: false,
      online: true,
    };

    this.props.navigation.navigate('SessionStart', {
      borne: borne,
      device: null,
      worker: null,
      scanner: this.scanner,
      manager: this.manager,
      readCharact: this.state.readCharact,
      currentSessionId: '99',
    });
    if (Platform.OS === 'android') {
      Geolocation.getCurrentPosition(
        async success => {
          await this.requestPermAndStartBtAndroid();
        },
        async error => {
          this.setState({
            errorMsg:
              'Votre service de localisation est désactivé. ' +
              "Merci de l'activer pour lancer une charge.",
          });
        },
      );
      return;
    } else {
      let state = await BluetoothStateManager.getState().then(res => {
        console.log(res);
        return res;
      });

      if (state === 'PoweredOn') {
        this.manager.enable().then(() => {
          console.log('[Bluetooth] activé');
        });
        this.props.navigation.navigate('Scanner');
      }
      return;
    }
  }

  /*=================================================================
  *
  *               PERMISSIONS BLUETOOTH & ACTIVATION
  *
  =================================================================*/

  async requestPermAndStartBtAndroid() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Bluetooth',
          message:
            'Activez le bluetooth pour vous connecter' +
            'à votre borne de recharge.',
          buttonNeutral: 'Ultérieurement',
          buttonPositive: 'Accepter',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('[Bluetooth] autorisé');
        this.manager.enable().then(() => {
          console.log('[Bluetooth] activé');
        });
        await this.verifBTandLocate();
      } else {
        console.log('[Bluetooth] permission refusée');
        return;
      }
    } catch (err) {
      console.log('[Bluetooth] ERREUR : ', err);
    }
  }

  async verifBTandLocate() {
    let state = await BluetoothStateManager.getState().then(res => {
      return res;
    });

    this.props.navigation.navigate('Scanner');
    this.setState({errorMsg: ''});
    this.setState({buttonTitle: 'Continuer'});
    return;
  }

  render() {
    return (
      <Container justifyContent={'flex-start'} alignItems={'center'}>
        <Space size={30} />

        <View style={styles.greyCircle}>
          <FontAwesomeIcon
            style={{alignSelf: 'center'}}
            icon={faBluetoothB}
            size={60}
            color={'white'}
          />
        </View>

        <Space size={30} />

        <View style={styles.infoBt}>
          <FontAwesomeIcon icon={faInfoCircle} size={30} color={'black'} />
          <Text style={{color: 'black', marginLeft: 12}}>
            {I18n.t('ble_explain')}
          </Text>
        </View>

        <Space size={60} />

        <ButtonLarge
          onPress={this.startRequests.bind(this)}
          title={this.state.buttonTitle}
        />

        <Space size={18} />

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

        <Space size={30} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  greyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'lightgrey',
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: 45,
  },
  infoBt: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    padding: 12,
    borderRadius: 9,
    marginHorizontal: 30,
  },
});

export default Bluetooth;

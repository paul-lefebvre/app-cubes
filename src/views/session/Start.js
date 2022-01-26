/* eslint-disable radix */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {Text, View, BackHandler, StyleSheet, Alert} from 'react-native';

//BLUETOOTH
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

//DIVERS
import bcrypt from 'react-native-bcrypt';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';

//LAYOUTS
import Container from '../../components/layout/Container';
import Space from '../../components/layout/Space';
import ButtonLarge from '../../components/buttons/ButtonLarge';

//CONSTANTS
import I18n from '../../i18n/i18n';
import {API_URL} from '../../config/utils';
import {sleep} from '../../Modbus/constants';

//MODBUS
import {StartChargeSession, readTenSessions} from '../../Modbus';
import Infos from '../../components/infos/Infos';

class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      borneID: null,
      errorMsg: '',
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  //BACK HANDLER
  async backAction() {
    console.log('BACK IOS');
  };

  //RETRIEVE USER DATAS (OFFLINE WORK)
  async UNSAFE_componentWillMount() {
    let user = JSON.parse(await AsyncStorage.getItem('user_profile'));
    this.setState({user: user});
  }

  //SYNCHRONIZE LOG SESSIONS WITH DATABASE FROM API
  async synchToDB(borneID, record) {
    let bodyData = {
      BorneID: parseInt(borneID),
      SessionID: parseInt(record[0]),
      PostUserID: this.state.user.id.toString(),
      ClientID: record[1],
      TsStart: record[2],
      TsStop: record[3],
      ChargeTime: record[4],
      ConnectTime: record[5],
      CptrWh: record[6],
      CptrPulse: record[7],
      PulseWeight: record[8],
      StartPeriod: record[9],
      LimitTime: record[10],
      Aux2: record[11],
      Aux3: record[12],
      Aux4: record[13],
      Aux5: record[14],
      Aux6: record[15],
      Aux7: record[16],
      EndStatus: record[17],
      StartKey: record[18],
      StopKey: record[19],
    };

    const salt = bcrypt.genSaltSync(2);

    bodyData['pass'] = bcrypt.hashSync(JSON.stringify(bodyData), salt);

    bodyData = JSON.stringify(bodyData);

    NetInfo.fetch().then(async function (state) {
      if (state.isConnected) {
        await fetch(API_URL + '/api/session/localsession', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: bodyData,
        }).then(response => {
          console.log(
            '[RESPONSE API] : Sended ? ',
            response.ok,
            '| status ',
            response.status,
          );
          return response.ok;
        });
      } else {
        console.log('NO INTERNET CONNEXION | LOCAL SAVE THIS : ', record[0]);
        await AsyncStorage.setItem('record_' + record[0], bodyData);
      }
    });
  }

  async startChargeSession() {
    this.setState({errorMsg: ''});

    let haveInternet = await NetInfo.fetch().then(value => {
      return value.isConnected;
    });

    let offlineToken = await AsyncStorage.getItem('offline_token');

    if (!haveInternet && offlineToken <= 0) {
      console.log('plus de jetons');
      this.setState({
        errorMsg:
          "Vous n'avez plus de jetons de charge hors-ligne.\n" +
          'Veuillez accéder à Internet pour obtenir de nouveaux jetons.',
      });
      return false;
    } else if (!haveInternet) {
      offlineToken = offlineToken - 1;
      console.log('REMOVED ONE JETON', offlineToken);
      await AsyncStorage.setItem('offline_token', offlineToken.toString());
    }

    let state = await BluetoothStateManager.getState().then(res => {
      console.log(res);
      return res;
    });

    if (state !== 'PoweredOn') {
      this.props.navigation.navigate('Bluetooth');
      return;
    }

    let res, sessions;
    let now = Math.floor(new Date().getTime() / 1000);
    let device = this.props.navigation.state.params.device;
    let worker = this.props.navigation.state.params.worker;
    let manager = this.props.navigation.state.params.manager;
    let lastSessionID = this.props.navigation.state.params.currentSessionId;
    lastSessionID--;
    let borneID = parseInt(this.props.navigation.state.params.borne.pseudo);

    sessions = await readTenSessions(
      device,
      worker,
      lastSessionID,
      manager,
    ).then(result => {
      return result;
    });

    if (sessions === false) {
      this.setState({
        errorMsg: 'Echec du démarrage de la charge. Veuillez réessayer.',
      });
      return false;
    }


    sleep(80);

    res = await StartChargeSession(
      this.state.user.id,
      now,
      device,
      worker,
    ).then(result => {
      return result;
    });

    if (res == false) {
      this.setState({
        errorMsg: 'Echec du démarrage de la charge. Veuillez réessayer.',
      });
      return false;
    }

    if (res) {
      await this.props.navigation.state.params.manager.cancelDeviceConnection(
        device.id,
      );
      this.setState({textInfo: ''});
      this.props.navigation.navigate('SessionProgress', {
        timestamp: now,
        scanner: this.props.navigation.state.params.scanner,
        borne: this.props.navigation.state.params.borne,
        lastSessionID: lastSessionID,
      });
      return true;
    }

    await this.props.navigation.state.params.manager.cancelDeviceConnection(
      device.id,
    );
    return true;
  }

  returnHome() {
    let device = this.props.navigation.state.params.device;
    this.props.navigation.state.params.manager.cancelDeviceConnection(
      device.id,
    );
    this.props.navigation.state.params.scanner.enable();
    this.props.navigation.state.params.scanner.reactivate();
    this.props.navigation.navigate('Home' /*{restartWaveScan: true}*/);
  }

  render() {
    return (
      <Container justifyContent={'center'} alignItems={'center'}>
        <Space size={30} />

        <View
          style={{backgroundColor: 'lightgrey', height: 210, width: '90%'}}
        />

        <Space size={30} />
        <Text style={styles.text}>
          {I18n.t('start_connected')}{' '}
          {this.props.navigation.state.params.borne.pseudo} {'\n'}
          {I18n.t('start_session_nb')}
          {this.props.navigation.state.params.currentSessionId}
        </Text>
        <Space size={30} />

        <ButtonLarge
          onPress={() => this.startChargeSession()}
          title={I18n.t('start_charge_btn')}
        />

        <Space size={18} />

        {this.state.errorMsg ? (
          <Infos
            displayInfos={true}
            isAnError={true}
            text={this.state.errorMsg}
          />
        ) : null}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
});

export default Start;

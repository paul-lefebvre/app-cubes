/* eslint-disable no-shadow */
/* eslint-disable no-bitwise */
/* eslint-disable no-new-wrappers */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {StyleSheet, Text, Alert, BackHandler, Platform} from 'react-native';

//BLUETOOTH
import {BleManager} from 'react-native-ble-plx';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

//QR CODE
import QRCodeScanner from 'react-native-qrcode-scanner';
import base64 from 'react-native-base64';

//CONSTANTS
import I18n from '../../i18n/i18n';
import {sleep} from '../../Modbus/constants';

//MODBUS
import {checkBorneAlreadyCharging, getLastSessionID} from '../../Modbus';

//LAYOUTS
import Space from '../../components/layout/Space';
import Container from '../../components/layout/Container';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import ButtonIcon from '../../components/buttons/ButtonIcon';
import ButtonLarge from '../../components/buttons/ButtonLarge';
import AlertCustom from '../../components/alerts/AlertCustom';
import FullScreenLoader from '../../components/layout/FullScreenLoader';

class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.manager = new BleManager();
    this.state = {
      borne: null,
      device: null,
      readCharact: null,
      workerCharacteristics: null,
      loading: false,
      msgIndicator: '',
      errorMsg: null,
      error: false,
      showAlert: false,
    };
  }

  componentDidMount() {
    this.scanner.enable();
    this.scanner.reactivate();

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.returnHome();
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  returnHome() {
    let device = this.state.device;
    if (device) {
      this.manager.cancelDeviceConnection(device.id);
    }
    this.scanner.enable();
    this.scanner.reactivate();
    this.props.navigation.navigate('Home');
  }

  async onSuccessScan(data) {
    this.scanner.disable();
    this.setState({msgIndicator: I18n.t('scanner_try_connect')});
    this.setState({loading: true});
    this.setState({showAlert: false});
    this.setState({errorMsg: null});

    let state = await BluetoothStateManager.getState().then(res => {
      return res;
    });

    if (state !== 'PoweredOn') {
      this.props.navigation.navigate('Bluetooth');
      return;
    }

    /* GESTION QR CODE */
    let byteStrQr = [];
    let byteStrPass = [];
    let result = new String();
    let stringPass = 'TWljcm9wcm91dCBGb3IgRXZlcg==';
    let stringQR = base64.decode(data.data);

    for (let i = 0; i < stringQR.length - 1; i++) {
      let codeQr = stringQR.charCodeAt(i);
      byteStrQr = byteStrQr.concat([codeQr]);
      if (i < stringPass.length) {
        let codePass = stringPass.charCodeAt(i);
        byteStrPass = byteStrPass.concat([codePass]);
      }
      result += String.fromCharCode(
        byteStrQr[i] ^ byteStrPass[i % stringPass.length],
      );
    }

    result = result.split('%');

    let borne = {
      pseudo: result[1].substring(8),
      name: result[1],
      address: '88:25:83:F3:0E:BF',
      paired: false,
      online: true,
      url: result[0],
    };

    console.log(borne);

    this.setState({borne: borne});
    let startTimeScan = new Date();

    /* START MATCH SCAN */
    this.manager.startDeviceScan(null, null, async (error, device) => {
      //COUNTER IN SEC AFTER STOP SCAN DEVICES
      let endTimeScan = new Date();
      let timeDiff = endTimeScan - startTimeScan;
      timeDiff /= 1000;
      let seconds = Math.round(timeDiff);

      if (error) {
        console.log('[BLUETOOTH]', '[SCAN]', error);
        this.manager.stopDeviceScan();
        if (error.errorCode === 102) {
          this.setState({showAlert: true});
          this.setState({
            errorMsg:
              I18n.t('error_bl_off') + '\n\n' + I18n.t('error_bl_action'),
          });
        } else {
          let errorMessage = error.message ? error.message : '';
          this.setState({showAlert: true});
          this.setState({
            errorMsg:
              I18n.t('error_borne') +
              ' ' +
              borne.pseudo +
              ' ' +
              I18n.t('error_difficult') +
              '\n' +
              errorMessage +
              ' CODE : ' +
              error.errorCode +
              '\n' +
              I18n.t('error_purpose_action'),
          });
        }
        this.setState({loading: false});
        sleep(5000);
        this.scanner.enable();
        this.scanner.reactivate();
        return false;
      }

      //START RETRYING CONNECT TO FOUND DEVICES
      let localName = '';

      if (device.localName) {
        localName = device.localName.slice(0, -2);
        console.log(localName);
      }
      if (
        device.id === borne.address ||
        (localName == borne.name && device.isConnectable === true)
      ) {
        this.setState({device: device});
        this.manager.stopDeviceScan();

        await device
          .connect({refreshGatt: true, autoConnect: false})
          .then(async device => {
            console.log('[BLUETOOTH] Connected to :', borne.pseudo);

            /* DISCOVER SERVICES & CHARACTERISTICS */
            await this.manager
              .discoverAllServicesAndCharacteristicsForDevice(device.id)
              .then(res => {});

            /* GET ARRAY OF SERVICES */
            await this.manager
              .servicesForDevice(device.id)
              .then(servicesDiscovered => {
                servicesDiscovered.forEach(async service => {
                  /* GET EACH CHARACTERISTICS OF A SERVICE */
                  await this.manager
                    .characteristicsForDevice(device.id, service.uuid)
                    .then(async characteristics => {
                      characteristics.forEach(async charact => {
                        if (
                          charact.isWritableWithResponse === true &&
                          charact.isReadable === true
                        ) {
                          let readCharact = {
                            uuid: charact.uuid,
                            serviceUUID: charact.serviceUUID,
                          };
                          this.setState({readCharact: readCharact});
                        }

                        if (
                          charact.isNotifiable === true &&
                          charact.isReadable === true &&
                          charact.isWritableWithoutResponse === true
                        ) {
                          let currentSessionId = await getLastSessionID(
                            device,
                            charact,
                          ).then(async result => {
                            return result;
                          });

                          if (currentSessionId === false) {
                            this.setState({loading: false});
                            this.scanner.reactivate();
                            this.scanner.enable();
                            this.manager.cancelDeviceConnection(device.id);
                            return false;
                          } else {
                            currentSessionId++;
                          }

                          sleep(85);

                          let isAlreadyInCharge =
                            await checkBorneAlreadyCharging(
                              device,
                              charact,
                            ).then(result => {
                              return result;
                            });

                          if (isAlreadyInCharge === 'MDBERROR') {
                            this.setState({loading: false});
                            this.scanner.enable();
                            this.scanner.reactivate();
                            this.manager.cancelDeviceConnection(device.id);
                            return false;
                          }

                          if (!isAlreadyInCharge) {
                            this.setState({loading: false});
                            this.props.navigation.navigate('SessionStart', {
                              borne: borne,
                              device: device,
                              worker: charact,
                              scanner: this.scanner,
                              manager: this.manager,
                              readCharact: this.state.readCharact,
                              currentSessionId: currentSessionId,
                            });
                            return true;
                          } else {
                            console.log(
                              "[WARNING] Borne déjà en cours d'utilisation",
                            );
                            this.setState({loading: false});
                            this.scanner.enable();
                            this.scanner.reactivate();
                            this.manager.cancelDeviceConnection(device.id);
                            this.setState({showAlert: true});
                            this.setState({
                              errorMsg:
                                I18n.t('error_borne') +
                                ' ' +
                                borne.pseudo +
                                ' ' +
                                I18n.t('error_already_use') +
                                ' \n' +
                                I18n.t('error_purpose_action'),
                            });
                            return false;
                          }
                        }
                      });
                    });
                });
              });
          })
          .catch(error => {
            let errorMessage = error.message ? error.message : '';
            console.log('[BLUETOOTH]', error);
            this.setState({showAlert: true});
            this.setState({
              errorMsg:
                I18n.t('error_borne') +
                ' ' +
                borne.pseudo +
                ' ' +
                I18n.t('error_difficult') +
                ' \n' +
                +errorMessage +
                ' CODE : ' +
                error.errorCode +
                '\n' +
                I18n.t('error_purpose_action'),
            });
            this.setState({loading: false});
            sleep(5000);
            this.scanner.enable();
            this.scanner.reactivate();
            return false;
          });
      }

      //FIN DU SCANNER (counter de tentatives)
      if (
        (seconds >= 10 && Platform.OS === 'android') ||
        (seconds >= 45 && Platform.OS === 'ios')
      ) {
        console.log('FIN DU SCAN');
        this.manager.stopDeviceScan();
        this.setState({showAlert: true});
        this.setState({
          errorMsg: I18n.t('error_borne_not_found'),
        });
        this.setState({loading: false});
        sleep(5000);
        this.scanner.enable();
        this.scanner.reactivate();
        return false;
      }
    });
  }

  render() {
    return (
      <>
        <Container justifyContent={'center'} alignItems={'center'}>
          <Space width={30} />

          <Text style={styles.text}>{I18n.t('scanner_explain')}</Text>

          <Space size={30} />

          <>
            <QRCodeScanner
              fadeIn
              showMarker
              cameraProps={{captureAudio: false}}
              cameraStyle={styles.cameraStyle}
              markerStyle={styles.markerStyle}
              ref={node => {
                this.scanner = node;
              }}
              onRead={this.onSuccessScan.bind(this)}
            />
          </>
        </Container>

        <FullScreenLoader
          loading={this.state.loading}
          text={this.state.msgIndicator}
          error={this.state.error}
        />
        <AlertCustom
          displayAlert={this.state.showAlert}
          alertTitleText={'Erreur'}
          displayAlertIcon={true}
          icon={faExclamationTriangle}
          alertMessageText={this.state.errorMsg}
          displayPositiveButton={true}
          positiveButtonText={'OK'}
          displayNegativeButton={false}
          onPressPositiveButton={() => this.setState({showAlert: false})}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  cameraStyle: {
    height: '100%',
  },
  markerStyle: {
    borderRadius: 30,
    borderColor: 'black',
  },
});

export default Scanner;

/* eslint-disable no-fallthrough */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';

import BTSerial from 'react-native-bluetooth-serial';
import AsyncStorage from '@react-native-community/async-storage';
import Swipeout from 'react-native-swipeout';

//LAYOUT
import * as Color from '../config/color';
import Space from '../layout/Space';

//MODBUS
import {
  checkBorneAlreadyCharging, getLastSessionID,
} from '../../Modbus';

//ICON
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBolt, faChevronRight} from '@fortawesome/free-solid-svg-icons';

//NAV & REDUX
import * as nav from '../../navigation/Navigation';
import {connect} from 'react-redux';

class SelectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listBornes: this.props.listBornes[0],
      paired: false,
      borne: null,
      loading: false,
      isEmptyList: true,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.listBornes[0].length > 0) {
      this.setState({isEmptyList: false});
    }
  }

  async goToStartSessionScreen(borne) {
    let currentSessionId = await getLastSessionID();
    currentSessionId++;
    let isAlreadyInCharge = null;

    await checkBorneAlreadyCharging().then(result => {
      this.setState({loading: false});
      isAlreadyInCharge = result;
    });

    if (isAlreadyInCharge === false ) {
      nav.navigate('SessionStart', {
        borne: borne,
        currentSessionId: currentSessionId,
      });
      return true;
    } else {
      console.log("[WARNING] Borne déjà en cours d'utilisation");
      Alert.alert(
        'Démarrage',
        'La borne ' +
          borne.name +
          " est déjà en cours d'utilisation.\n\n" +
          'Veuillez patienter ou séléctionner une borne disponible.',
        [{text: "D'accord", onPress: () => null}],
      );
      await BTSerial.disconnect();
      return false;
    }
  }

  async checkSelectedDevice(borne) {
    this.setState({loading: true});
    this.setState({borne: borne});

    await BTSerial.disconnect();

    try {
      await BTSerial.connect(borne.address).then(res => {
        if (res) {
          console.log('connected');
        }
      });
    } catch (err) {
      this.setState({loading: false});
      return false;
    }

    await this.goToStartSessionScreen(borne);

    this.setState({loading: false});
  }

  async deleteSavedBorne(item) {
    item.removed = true;
    await AsyncStorage.setItem(item.name, JSON.stringify(item));
  }

  renderList() {
    if (this.props.listBornes[0]) {
      let data = this.props.listBornes[0];
      return data.map((item, index) => {
        if (!item.removed) {
          const name = item.name;
          let swipeBtns = [
            {
              text: 'Supprimer',
              backgroundColor: 'darkred',
              onPress: () => {
                this.deleteSavedBorne(item);
              },
            },
          ];
          return (
            <View key={index}>
              <Swipeout
                left={swipeBtns}
                disabled={this.state.loading ? true : false}
                autoClose={true}
                style={{
                  borderRadius: 15,
                }}
                backgroundColor="transparent">
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.3}
                  disabled={
                    this.state.loading
                      ? true
                      : false ||
                        // eslint-disable-next-line no-constant-condition
                        item.online === false
                      ? true
                      : false
                  }
                  onPress={() => this.checkSelectedDevice(item)}
                  style={[
                    styles.touchableContainer,
                    {
                      borderColor:
                        item.online === false ? 'lightgrey' : 'black',
                    },
                  ]}>
                  <View style={styles.textContainer}>
                    <Text style={styles.text}>Borne {item.name}</Text>
                    <Space size={1.5} />

                    {/* STATUS BORNE*/}
                    {
                      {
                        true: (
                          <Text style={styles.text}>
                            <FontAwesomeIcon
                              icon={faBolt}
                              size={15}
                              color={'lightgreen'}
                            />
                            {''} En ligne
                          </Text>
                        ),
                        wait: (
                          <Text style={styles.text}>
                            <FontAwesomeIcon
                              icon={faBolt}
                              size={15}
                              color={'lightblue'}
                            />
                            {''} Déjà utilisée
                          </Text>
                        ),
                        false: (
                          <Text style={styles.text}>
                            <FontAwesomeIcon
                              icon={faBolt}
                              size={15}
                              color={'red'}
                            />
                            {''} Hors ligne
                          </Text>,
                        ),
                      }[item.online]
                    }
                    {/* END STATUS BORNE */}
                  </View>
                  {this.state.loading && this.state.borne.name === name ? (
                    <ActivityIndicator size={18} color={Color.secondColor} />
                  ) : (
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      color={
                        item.online === false ? 'lightgrey' : Color.secondColor
                      }
                      size={18}
                    />
                  )}
                </TouchableOpacity>
              </Swipeout>
              <Space size={18} />
            </View>
          );
        }
      });
    }
  }

  render() {
    return (
      <View
        style={styles.listContainer}
        contentContainerStyle={{alignItems: 'center'}}>
        {this.renderList()}

        <Space size={18} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'column',
    marginLeft: 12,
  },
  touchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    padding: 21,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 21,
    borderColor: 'lightgrey',
    backgroundColor: Color.colorBackground,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    paddingLeft: 6,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: Color.secondColor,
  },
  dotStatus: {
    width: 12,
    height: 12,
    borderRadius: 60,
  },
});

const mapStateToProps = state => {
  return {
    listBornes: state.listBornes,
  };
};

export default connect(mapStateToProps)(SelectList);

/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//LAYOUTS
import Container from '../../components/layout/Container';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import Space from '../../components/layout/Space';

//ICON
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCoins} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../i18n/i18n';
import * as Color from '../../components/config/color';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BillCard from '../../components/cards/BillCard';
import {API_URL} from '../../config/utils';

class Bill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      bill: null,
      sessionID: this.props.navigation.state.params.sessionID
        ? this.props.navigation.state.params.sessionID
        : null,
    };
  }

  async componentDidMount() {
    const JWT_TOKEN = await AsyncStorage.getItem('id_token');
    let user = JSON.parse(await AsyncStorage.getItem('user_profile'));
    this.setState({user: user});

    // GET BILL OF SESSION
    let bill = await fetch(
      API_URL +
        '/api/bills?clientId=' +
        this.state.user.id +
        '&sessionId=' +
        this.state.sessionID,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + JWT_TOKEN,
        },
      },
    )
      .then(res => res.json())
      .then(async function (result) {
        return result[0];
      });

    if (bill.code === 401) {
      this.refreshToken();
    } else {
      this.setState({bill: bill});
    }
    return;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const state = this.state;
    return (
      <>
        <ScrollView>
          <Container justifyContent={'center'} alignItems={'center'}>
            <Space size={9} />

            <View style={styles.headerText}>
              <View style={styles.viewAccount}>
                <Space size={30} />
                <Text style={styles.titleAccount}>Ma Facture</Text>
              </View>
            </View>
            <Space size={30} />

            <BillCard bill={state.bill ? state.bill : null} />
            <Space size={30} />
          </Container>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    flex: 0.2,
    width: '100%',
    paddingHorizontal: '7%',
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAccount: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  titleAccount: {
    fontSize: 21,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textAccount: {
    fontSize: 15,
    color: 'black',
  },
  logoutText: {
    textDecorationLine: 'underline',
  },
});

export default Bill;

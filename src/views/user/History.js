/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {Text, View, StyleSheet, ScrollView, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//LAYOUTS
import Container from '../../components/layout/Container';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import Space from '../../components/layout/Space';

//COMPONENTS
import ButtonIcon from '../../components/buttons/ButtonIcon';

//ICON
import {faChevronCircleUp} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import Card from '../../components/cards/Card';
import {API_URL, refreshToken} from '../../config/utils';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      sessionsData: [],
      loadingExtraData: false,
      page: 1,
      JWT_TOKEN: null,
      loading: false,
    };
  }

  async componentDidMount() {
    this.setState({loading: true});

    let user = JSON.parse(await AsyncStorage.getItem('user_profile'));
    await refreshToken();
    this.setState({user: user});

    const JWT_TOKEN = await AsyncStorage.getItem('id_token');
    this.setState({JWT_TOKEN: JWT_TOKEN});

    await this.loadSessionsData();

    this.setState({loading: false});
  }

  async loadBill(sessionID) {
    let bill = await fetch(API_URL + '/api/bills?sessionId=' + sessionID, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.JWT_TOKEN,
      },
    })
      .then(res => res.json())
      .then(async function (result) {
        return result[0];
      });
    return bill;
  }

  async loadSessionsData() {
    try {
      let sessions = await fetch(
        API_URL +
          '/api/sessions?page=' +
          this.state.page +
          '&ClientID=' +
          this.state.user.id,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.state.JWT_TOKEN,
          },
        },
      )
        .then(res => res.json())
        .then(async function (result) {
          return result;
        });

      if (sessions !== []) {
        sessions.map(async (session, index) => {
          let bill = await this.loadBill(session.id);
          sessions[index].bill = bill;
        });
      }

      this.setState({
        sessionsData:
          this.state.page === 1
            ? sessions
            : [...this.state.sessionsData, ...sessions],
      });
    } catch (error) {
      console.log('[ERROR]', error);
    }
  }

  loadMoreSessions = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => this.loadSessionsData(this.state.JWT_TOKEN),
    );
  };

  renderCards = ({item}, index) => {
    let date = new Date(item.TsStart * 1000).toLocaleDateString();
    return (
      <>
        <Card
          title={item.sessionID}
          date={date}
          borne={item.borneID}
          time={item.chargeTimeConv}
          bill={item.bill}
          onPress={() => this.goBillUser(item.id)}
        />
        <Space size={30} />
      </>
    );
  };

  scrollToTop() {
    this.listRef.scrollToOffset({animated: true, offset: 0});
  }

  keyExtractor = (item, index) => item.id;

  goBillUser(sessionID) {
    this.props.navigation.navigate('Bill', {sessionID: sessionID});
  }

  render() {
    const state = this.state;
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            backgroundColor: 'white',
          }}>
          <Space size={9} />

          <View style={styles.headerText}>
            <View style={styles.viewAccount}>
              <Space size={30} />
              <Text style={styles.titleAccount}>Mon historique</Text>
            </View>
          </View>
          <Space size={30} />

          <FlatList
            ref={ref => {
              this.listRef = ref;
            }}
            data={this.state.sessionsData}
            renderItem={this.renderCards}
            keyExtractor={this.keyExtractor}
            onEndReachedThreshold={0.05}
            onEndReached={this.loadMoreSessions}
            centerContent
            style={{
              flex: 1,
              paddingVertical: 21,
              width: '100%',
            }}
          />
        </View>

        {/*<FullScreenLoader
          loading={this.state.sessionsData.length > 0 ? false : true}
          text={'Récupération de votre historique...'}
        />*/}
        <ButtonIcon
          onPress={this.scrollToTop.bind(this)}
          size={45}
          activeOpacity={0.6}
          noBorder
          icon={faChevronCircleUp}
          color={'#1470b9'}
          style={{
            position: 'absolute',
            bottom: 21,
            right: 21,
          }}
        />
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

export default History;

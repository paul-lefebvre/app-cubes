/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {Text, View, StyleSheet, ScrollView, RefreshControl, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//LAYOUTS
import Container from '../../components/layout/Container';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import Space from '../../components/layout/Space';

//COMPONENTS
import ButtonIcon from '../../components/buttons/ButtonIcon';
import TicketList from '../../components/lists/TicketList';

//ICON
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronCircleUp} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../i18n/i18n';
import * as Color from '../../components/config/color';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {
  API_URL,
  KEY_SUPPORT,
  refreshToken,
  SUPPORT_URL,
} from '../../config/utils';
import ButtonLarge from '../../components/buttons/ButtonLarge';

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      ticketsData: null,
      refreshing: false,
    };
  }

  async UNSAFE_componentWillReceiveProps(props) {
    if (props.navigation.state.params.reloadView) {
      await this.loadTickets();
    }
  }

  async componentDidMount() {
    let user = JSON.parse(await AsyncStorage.getItem('user_profile'));
    this.setState({user: user});
    await this.loadTickets();
  }

  async loadTickets() {
    this.setState({refreshing: true});
    this.setState({ticketsData: null});
    try {
      let tickets = await fetch(
        SUPPORT_URL +
          '/api/conversations?api_key=' +
          KEY_SUPPORT +
          '&customerEmail=' +
          this.state.user.email,
        {
          method: 'GET',
          headers: {
            Accept: 'application/hal+json',
            'Content-Type': 'application/json; charset=UTF-8',
          },
        },
      )
        .then(res => res.json())
        .then(async function (result) {
          result = result._embedded.conversations;
          return result;
        });
      this.setState({ticketsData: tickets});
    } catch (error) {
      console.log('[ERROR]', error);
    }
    this.setState({refreshing: false});
    return;
  }

  renderTickets() {
    return this.state.ticketsData.map((item, index) => {
      if (item.type === 'email') {
        let isTicketCLosed = item.status === 'closed' ? true : false;
        return (
          <TouchableOpacity
            activeOpacity={0.96}
            onPress={() => this.goToTicket(item.id, isTicketCLosed)}>
            <TicketList
              idTicket={item.id}
              subject={item.subject}
              preview={item.preview}
              status={item.status}
              isJustCreated={item.threadsCount === 1 ? true : false}
              lastReplyer={item.customerWaitingSince.latestReplyFrom}
              time={item.customerWaitingSince.friendly}
            />
            <Space size={30} />
          </TouchableOpacity>
        );
      }
    });
  }

  goToCreateReport() {
    this.props.navigation.navigate('CreateReport');
  }

  goToTicket(ticketID, ticketClosed) {
    this.props.navigation.navigate('DetailReport', {
      ticketID: ticketID,
      ticketClosed: ticketClosed,
    });
  }

  render() {
    const state = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'flex-start'}} >
        <Space size={18} />
        <ButtonLarge
          onPress={() => this.goToCreateReport()}
          title={'Contacter le Support'}
        />
        <Space size={30} />
        <Text style={styles.titleAccount}>VOS CONVERSATIONS</Text>
        <Space size={30} />
        <ScrollView
          style={styles.scrollTicketsContainer}
          refreshControl={
            <RefreshControl
              tintColor={Color.secondColor}
              colors={Platform.OS === 'android' ? ['white'] : null}
              progressBackgroundColor={Platform.OS === 'android' ? Color.secondColor : null}
              refreshing={this.state.refreshing}
              onRefresh={this.loadTickets.bind(this)}
            />
          }>
          {state.ticketsData ? this.renderTickets() : null}
        </ScrollView>
      </View>
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
  scrollTicketsContainer: {
    flex: 1,
    width: '100%',
  },
  viewAccount: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  titleAccount: {
    fontSize: 18,
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

export default Report;

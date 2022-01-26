/* eslint-disable no-useless-escape */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  useWindowDimensions,
  RefreshControl,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RenderHtml from 'react-native-render-html';

//LAYOUTS
import Container from '../../components/layout/Container';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import Space from '../../components/layout/Space';

//ICON
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCheck,
  faCheckCircle,
  faCoins,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../i18n/i18n';
import * as Color from '../../components/config/color';

import {SUPPORT_URL, KEY_SUPPORT} from '../../config/utils';
import {TouchableOpacity} from 'react-native-gesture-handler';

class DetailReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      threads: [],
      ticket: null,
      ticketID: this.props.navigation.state.params.ticketID
        ? this.props.navigation.state.params.ticketID
        : null,
      inputIsFocused: false,
      newThread: null,
      refreshing: false,
      ticketClosed: this.props.navigation.state.params.ticketClosed
        ? this.props.navigation.state.params.ticketClosed
        : false,
    };
  }

  async componentDidMount() {
    let user = JSON.parse(await AsyncStorage.getItem('user_profile'));
    this.setState({user: user});

    await this.getTicketThreads();
  }

  async getTicketThreads() {
    this.setState({refreshing: true});
    try {
      let threads = await fetch(
        SUPPORT_URL +
          '/api/conversations/' +
          this.state.ticketID +
          '?api_key=' +
          KEY_SUPPORT,
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
          return result;
        });
      this.setState({ticket: threads});
      this.setState({threads: []});
      threads = threads._embedded.threads;
      threads.map(item => {
        if (item.type === 'customer' || item.type === 'message') {
          this.state.threads.push(item);
        }
      });
      this.setState({
        threads: this.state.threads.sort(function (a, b) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }),
      });
    } catch (error) {
      console.log('[ERROR]', error);
    }
    this.setState({refreshing: false});
    return;
  }

  renderThread() {
    return this.state.threads.map(item => {
      const {height, width} = Dimensions.get('screen');
      const source = {html: item.body};
      console.log(source);
      return (
        <>
          <View
            style={
              item.source.via === 'customer'
                ? styles.bubbleCustomer
                : styles.bubbleSupport
            }>
            <RenderHtml
              baseStyle={{
                maxWidth: '95%',
              }}
              tagsStyles={{
                body: {maxWidth: '100%'},
                div: {maxWidth: width - 160},
              }}
              contentWidth={width}
              source={source}
            />
            <Space size={6} />
            <Text style={styles.bottomInfos}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Space size={18} />
        </>
      );
    });
  }

  async sendNewThread() {
    if (this.state.newThread === null) {
      console.log('msg null');
      return;
    }

    try {
      let response = await fetch(
        SUPPORT_URL +
          '/api/conversations/' +
          this.state.ticketID +
          '/threads?api_key=' +
          KEY_SUPPORT,
        {
          method: 'POST',
          headers: {
            Accept: 'application/hal+json',
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            text: this.state.newThread,
            type: 'customer',
            customer: {
              email: this.state.user.email,
              firstName: this.state.user.firstname,
              lastName: this.state.user.name,
            },
          }),
        },
      )
        .then(res => res.json())
        .then(async function (result) {
          return result;
        });
      if (response.state === 'published') {
        this.inputMsg.clear();
        this.inputMsg.blur();
        this.setState({threads: []});
        await this.getTicketThreads();
        this.scrollPage.scrollToEnd({animated: true});
      }
    } catch (error) {
      console.log('[ERROR]', error);
    }
    return;
  }

  updateMessageState(value) {
    this.setState({newThread: value});
  }

  inputFocused() {
    this.scrollPage.scrollToEnd({animated: true});
    this.setState({inputIsFocused: true});
  }

  inputNotFocused() {
    this.setState({inputIsFocused: false});
  }

  render() {
    const state = this.state;
    return (
      <>
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={Color.secondColor}
              colors={['white']}
              progressBackgroundColor={Color.secondColor}
              refreshing={this.state.refreshing}
              onRefresh={this.getTicketThreads.bind(this)}
            />
          }
          ref={scroll => {
            this.scrollPage = scroll;
          }}>
          <Container justifyContent={'center'} alignItems={'center'}>
            <Space size={9} />

            <View style={styles.headerText}>
              <View style={styles.viewHeader}>
                <Space size={12} />
                <Text style={styles.titleAccount}>
                  {state.ticket ? state.ticket.subject : ''} #
                  {state.ticket ? state.ticket.id : ''}
                </Text>
                <Text>
                  {state.ticket
                    ? new Date(this.state.ticket.createdAt).toLocaleString()
                    : null}
                </Text>
              </View>
            </View>
            <Space size={30} />
            <View
              style={[
                styles.chat,
                {marginBottom: state.inputIsFocused ? 60 : 0},
              ]}>
              {this.renderThread()}
              <Space size={60} />
            </View>
            {state.ticketClosed ? (
              <View style={styles.isClosed}>
                <FontAwesomeIcon size={60} color={'green'} icon={faCheck} />
                <Space size={21} />
                <Text style={{fontSize: 18}}>
                  Cette conversation est terminée.
                </Text>
              </View>
            ) : null}
          </Container>
        </ScrollView>
        {state.ticketClosed ? null : (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              height: state.inputIsFocused ? 120 : 60,
              width: '100%',
              bottom: 0,
              borderTopWidth: 0.5,
              borderTopColor: 'lightgrey',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
            }}>
            <TextInput
              ref={inputMsg => {
                this.inputMsg = inputMsg;
              }}
              style={[styles.newInput]}
              value={state.newThread}
              numberOfLines={5}
              placeholder={'Envoyer un message...'}
              multiline={true}
              onFocus={this.inputFocused.bind(this)}
              onBlur={this.inputNotFocused.bind(this)}
              onChangeText={value => this.updateMessageState(value)}
            />
            <TouchableOpacity
              activeOpacity={0.81}
              onPress={this.sendNewThread.bind(this)}
              style={{
                flex: 1,
                maxHeight: 45,
                borderRadius: 30,
                width: 45,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <FontAwesomeIcon icon={faPaperPlane} size={21} color={'white'} />
            </TouchableOpacity>
          </View>
        )}
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
  chat: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 15,
  },
  newInput: {
    flex: 0.9,
    fontSize: 15,
    borderColor: '#ccc',
  },
  bubbleSupport: {
    flex: 1,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 12,
    textAlign: 'left',
    backgroundColor: 'lightgrey',
    borderRadius: 12,
  },
  bubbleCustomer: {
    flex: 1,
    alignSelf: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 12,
    textAlign: 'left',
    backgroundColor: 'lightblue',
    borderRadius: 12,
  },
  viewHeader: {
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
  bottomInfos: {
    color: 'grey',
    fontSize: 12,
    textAlign: 'left',
  },
  isClosed: {
    flex: 1,
    backgroundColor: 'lightgrey',
    height: 180,
    width: '95%',
    borderRadius: 12,
    marginBottom: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DetailReport;

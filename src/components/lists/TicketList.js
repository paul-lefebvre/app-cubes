/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCheck,
  faCheckSquare,
  faChevronRight,
  faCommentDots,
  faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Container from '../layout/Container';
import Space from '../layout/Space';
import {KEY_SUPPORT, SUPPORT_URL} from '../../config/utils';

class TicketList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: this.props.subject ? this.props.subject : '',
      lastReplyer: this.props.lastReplyer ? this.props.lastReplyer : '',
      preview: this.props.preview ? this.props.preview : '',
      time: this.props.time ? this.props.time : '',
      isJustCreated: this.props.isJustCreated
        ? this.props.isJustCreated
        : false,
      status: this.props.status,
      threads: [],
      threadLength: 0,
    };
  }

  async UNSAFE_componentWillMount() {
    if (this.props.idTicket) {
      try {
        let threads = await fetch(
          SUPPORT_URL +
            '/api/conversations/' +
            this.props.idTicket +
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
            result = result._embedded.threads;
            return result;
          });
        threads.map(item => {
          if (item.type === 'customer' || item.type === 'message') {
            this.state.threads.push(item);
          }
        });
        this.setState({threadLength: this.state.threads.length});
      } catch (error) {
        console.log('[ERROR] :', error);
      }
    }
  }

  renderIconStatus(status) {
    if (status === 'active') {
      return (
        <FontAwesomeIcon
          style={styles.icon}
          icon={faHourglassHalf}
          color={'orange'}
          size={18}
        />
      );
    } else if (status === 'pending') {
      return (
        <FontAwesomeIcon
          style={styles.icon}
          icon={faCommentDots}
          color={'white'}
          size={21}
        />
      );
    } else if (status === 'closed') {
      return (
        <FontAwesomeIcon
          style={styles.icon}
          icon={faCheck}
          color={'lightgreen'}
          size={21}
        />
      );
    }
  }

  lastReplyerFormat(replyer) {
    if (this.state.threadLength <= 1) {
      return 'Merci. Votre demande va être pris en charge par notre équipe.';
    }
    if (replyer === 'user') {
      return 'Support :';
    } else if (replyer === 'customer' && this.state.threadLength > 1) {
      return 'Vous :';
    }
  }

  render() {
    const state = this.state;
    return (
      <View style={styles.container}>
        <Space size={18} />
        <View style={styles.rowContainer}>
          <View style={styles.backIcon}>
            {this.renderIconStatus(state.status)}
          </View>
          <Space size={18} />
          <Container
            backgroundColor={'lightgrey'}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}>
            <Text style={styles.subject}>{state.subject}</Text>
            <Text style={styles.text}>{state.time}</Text>
            <Text
              style={styles.preview}
              numberOfLines={2}
              ellipsizeMode={'tail'}>
              {this.lastReplyerFormat(state.lastReplyer)} {state.preview}
            </Text>
          </Container>
          <FontAwesomeIcon
            icon={faChevronRight}
            size={15}
            color={'black'}
            style={{alignSelf: 'center'}}
          />
        </View>
        <Space size={12} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 145,
    width: '95%',
    borderRadius: 9,
    alignSelf: 'center',
    backgroundColor: 'lightgrey',
  },
  rowContainer: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  backIcon: {
    height: 45,
    width: 45,
    padding: 12,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 32,
  },
  icon: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  subject: {
    fontSize: 18,
    marginLeft: 18,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  preview: {
    marginLeft: 18,
    marginRight: 12,
    marginTop: 9,
    fontSize: 15,
    fontWeight: '300',
    letterSpacing: 0.1,
    color: 'black',
  },
  text: {
    marginLeft: 18,
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 0.1,
    color: 'black',
  },
});

export default TicketList;

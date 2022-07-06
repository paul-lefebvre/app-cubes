/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import * as Color from '../config/color';
import Space from '../layout/Space';
import Avatar from '../avatar/Avatar';
import {
  faEllipsisV,
  faGripVertical,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';

import {faCommentDots, faHeart} from '@fortawesome/free-regular-svg-icons';

export default class PostCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.loading ? this.props.loading : false,
    };
  }

  async onPress() {
    this.setState({loading: true});
    await this.props.onPress();
    this.setState({loading: false});
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.profil}>
            <Avatar />
            <Text style={[styles.text, {paddingLeft: 21}]}>
              {this.props.firstname} {this.props.lastname}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actions}>
            <FontAwesomeIcon
              icon={faEllipsisV}
              color={Color.darkBlue}
              size={18}
            />
          </TouchableOpacity>
        </View>
        <Image
          style={styles.resImg}
          source={
            this.props.url
              ? this.props.url
              : require('../../assets/img/logo.png')
          }
        />
        <View style={styles.answers}>
          <Text style={styles.text}>
            {this.props.answers ? this.props.answers : '...'}
          </Text>
        </View>
        <View style={styles.footer}>
          <Space width={9} />
          <TouchableOpacity style={styles.actions}>
            <Text style={styles.counterText}>3</Text>
            <FontAwesomeIcon
              icon={faHeart}
              color={Color.darkMagenta}
              size={27}
            />
          </TouchableOpacity>
          <Space width={30} />
          <TouchableOpacity style={styles.actions}>
            <Text style={styles.counterText}>3</Text>
            <FontAwesomeIcon
              icon={faCommentDots}
              color={Color.darkBlue}
              size={27}
            />
          </TouchableOpacity>
          <Space width={45} />
          {this.props.category ? (
            <Text style={[styles.text, styles.category]}>
              {this.props.category.title}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 600,
    minHeight: 450,
    width: '95%',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: Color.componentBg,
  },
  header: {
    flex: 0.1,
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 15,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  footer: {
    flex: 0.1,
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 15,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  profil: {
    flex: 0.5,
    justifyContent: 'space-around',
    marginLeft: 9,
    alignItems: 'center',
    flexDirection: 'row',
  },
  actions: {
    flex: 0.18,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  resImg: {
    flex: 0.9,
    width: '100%',
    resizeMode: 'contain',
  },
  answers: {
    backgroundColor: 'white',
    padding: 12,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
    letterSpacing: 0.1,
    color: 'black',
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    backgroundColor: Color.gray,
  },
  category: {
    width: 120,
    borderRadius: 21,
    textAlign: 'center',
    backgroundColor: Color.blue,
    color: 'white',
    right: 21,
    bottom: 15,
    position: 'absolute',
    paddingVertical: 3,
  },
});

import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import * as Color from '../config/color';
import Space from '../layout/Space';
import Avatar from '../avatar/Avatar';
import {faGripVertical, faPaperPlane} from '@fortawesome/free-solid-svg-icons';

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
            <Text style={styles.text}>
              {this.props.firstname} {this.props.lastname}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actions}>
            <FontAwesomeIcon
              icon={faGripVertical}
              color={Color.darkBlue}
              size={30}
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
        <View style={styles.footer}>
          <TouchableOpacity style={styles.actions}>
            <FontAwesomeIcon
              icon={faHeart}
              color={Color.darkMagenta}
              size={27}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actions}>
            <FontAwesomeIcon
              icon={faCommentDots}
              color={Color.darkBlue}
              size={27}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actions}>
            <FontAwesomeIcon
              icon={faPaperPlane}
              color={Color.darkBlue}
              size={27}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 300,
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
    alignItems: 'center',
  },
  resImg: {
    flex: 0.9,
    width: '100%',
    resizeMode: 'contain',
  },
  text: {
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
    letterSpacing: 0.1,
    color: 'black',
  },
});

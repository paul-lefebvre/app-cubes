/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import ButtonLarge from '../buttons/ButtonLarge';

import * as Color from '../config/color';
import Space from '../layout/Space';

export default class SmallUserCard extends React.Component {
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
      <TouchableOpacity
        activeOpacity={0.81}
        disabled={this.state.loading ? true : false}
        onPress={this.onPress.bind(this)}
        style={[styles.container, this.props.style]}>
        {this.state.loading ? (
          <ActivityIndicator color={'white'} />
        ) : (
          <>
            <Space size={12} />
            <Image
              style={styles.profilImg}
              source={
                this.props.url
                  ? this.props.url
                  : require('../../assets/img/logo.png')
              }
            />
            <Space size={6} />
            <Text style={styles.text}>
              {this.props.firstname} {this.props.lastname}
            </Text>
            <Text style={styles.text}>{this.props.pseudo}</Text>
            <Space size={12} />
            <ButtonLarge
              style={{width: '90%', height: 45}}
              onPress={() => null}
              title={"S'abonner"}
            />
            <Space size={9} />
          </>
        )}
      </TouchableOpacity>
    );
  }
}

let width =
  Dimensions.get('window').width - Dimensions.get('window').width * 0.5;

const styles = StyleSheet.create({
  container: {
    height: 230,
    width: width,
    marginLeft: 12,
    marginRight: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  profilImg: {
    width: 90,
    height: 90,
    borderWidth: 3,
    borderRadius: 180,
    borderColor: Color.darkMagenta,
  },
  text: {
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    letterSpacing: 0.1,
    color: 'black',
  },
});

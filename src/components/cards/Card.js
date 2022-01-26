/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import TextPlaceHolder from '../placeholders/TextPlaceHolder';
import ButtonLarge from '../buttons/ButtonLarge';
import Space from '../layout/Space';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.loading ? this.props.loading : false,
      date: this.props.date ? this.props.date : null,
      borne: this.props.bone ? this.props.borne : null,
      time: this.props.time ? this.props.time : null,
      onPress: this.props.onPress ? this.props.onPress : null,
      title: this.props.title ? this.props.title : '',
      bill: this.props.bill ? this.props.bill : '',
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.bill !== undefined) {
      this.setState({bill: props.bill});
    }
    console.log(props.bill);
  }

  render() {
    const state = this.state;
    return (
      <View style={styles.container}>
        <Space size={12} />
        <Text style={styles.titleCharge}>Charge n°{state.title}</Text>
        <Space size={12} />
        <View style={styles.rowTextContainer}>
          <Text style={styles.text}>Borne :</Text>
          <Text style={styles.text}>{this.props.borne}</Text>
        </View>
        <Space size={6} />
        <View style={styles.rowTextContainer}>
          <Text style={styles.text}>Date :</Text>
          <Text style={styles.text}>{state.date}</Text>
        </View>
        <Space size={6} />
        <View style={styles.rowTextContainer}>
          <Text style={styles.text}>Temps de charge :</Text>
          <Text style={styles.text}>{state.time}</Text>
        </View>
        <Space size={6} />
        <View style={styles.rowTextContainer}>
          <Text style={styles.text}>Coût TTC :</Text>
          <Text style={[styles.text, {fontWeight: 'bold'}]}>
            {this.state.bill ? (
              state.bill.totalCost.toFixed(2) + '€'
            ) : (
              <TextPlaceHolder />
            )}
          </Text>
        </View>
        <Space size={12} />
        <ButtonLarge
          style={{
            width: '90%',
          }}
          onPress={() => (state.onPress ? state.onPress() : null)}
          title={'Voir le détail'}
        />
        <Space size={12} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%',
    borderRadius: 9,
    alignSelf: 'center',
    backgroundColor: 'lightgrey',
  },
  rowTextContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleCharge: {
    alignSelf: 'center',
    alignContent: 'center',
    fontSize: 21,
    fontWeight: 'bold',
    letterSpacing: 0.1,
    color: 'black',
  },
  text: {
    flex: 1,
    paddingHorizontal: '3%',
    fontSize: 15,
    fontWeight: '300',
    letterSpacing: 0.1,
    color: 'black',
  },
});

export default Card;

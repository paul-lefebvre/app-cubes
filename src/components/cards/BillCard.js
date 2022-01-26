/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Space from '../layout/Space';

class BillCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.loading ? this.props.loading : false,
      bill: null,
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.bill !== null) {
      this.setState({bill: newProps.bill});
      this.forceUpdate();
    }
  }

  render() {
    const state = this.state;
    const bill = this.props.bill;
    return (
      <View style={styles.container}>
        <Space size={18} />
        <Text style={styles.titleCharge}>
          Facture{' '}
          {bill ? 'n°B' + bill.id + 'S' + bill.sessionId : 'Indisponible'}
        </Text>
        <Space size={18} />

        <View style={styles.rowTextContainer}>
          <Text style={styles.subtitle}>Borne :</Text>
          <Text style={styles.text}>{bill ? bill.borneId : null}</Text>
        </View>

        <Space size={12} />
        <View style={styles.rowTextContainer}>
          <Text style={styles.subtitle}>Coût de connexion :</Text>
          <Text style={styles.text}>
            {bill ? bill.connexionCost.toFixed(2) : null}€
          </Text>
        </View>

        <Space size={12} />
        <View style={styles.rowTextContainer}>
          <Text style={styles.subtitle}>Coût de charge :</Text>
          <Text style={styles.text}>
            {bill ? bill.chargeCost.toFixed(2) : null}€
          </Text>
        </View>

        <Space size={12} />
        <View style={styles.rowTextContainer}>
          <Text style={styles.subtitle}>Coût énergetique :</Text>
          <Text style={styles.text}>
            {bill ? bill.energyCost.toFixed(2) : null}€
          </Text>
        </View>

        <Space size={12} />
        <View style={styles.rowTextContainer}>
          <Text style={styles.subtitle}>Coût d'inactivité :</Text>
          <Text style={styles.text}>
            {bill ? bill.idleCost.toFixed(2) : null}€
          </Text>
        </View>

        <Space size={12} />
        <View style={styles.rowTextContainer}>
          <Text style={styles.subtitle}>Total HT :</Text>
          <Text style={styles.text}>
            {bill ? bill.htCost.toFixed(2) : null}€
          </Text>
        </View>

        <Space size={21} />
        <View style={styles.rowTextContainer}>
          <Text style={styles.subtitle}>Total TTC :</Text>
          <Text style={[styles.text, {fontWeight: 'bold'}]}>
            {bill ? bill.totalCost.toFixed(2) : null}€
          </Text>
        </View>

        <Space size={30} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%',
    borderRadius: 9,
    marginBottom: 9,
    backgroundColor: 'lightgrey',
  },
  rowTextContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCharge: {
    alignSelf: 'center',
    alignContent: 'center',
    fontSize: 21,
    fontWeight: 'bold',
    letterSpacing: 0.1,
    color: 'black',
  },
  subtitle: {
    flex: 1,
    paddingHorizontal: '3%',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.1,
    color: 'black',
  },
  text: {
    flex: 0.5,
    paddingHorizontal: '3%',
    textAlign: 'right',
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 0.1,
    color: 'black',
  },
});

export default BillCard;

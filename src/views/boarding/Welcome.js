/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {TouchableHighlight, StyleSheet, Text, View} from 'react-native';

import Swiper from 'react-native-swiper';

//LAYOUTS
import * as Color from '../../components/config/color';
import Container from '../../components/layout/Container';
import ButtonLarge from '../../components/buttons/ButtonLarge';

//ICON
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowRight, faCheck, faGift} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../i18n/i18n';
import {appName} from '../../config/utils';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const state = this.state;
    return (
      <Container justifyContent={'flex-start'} alignItems={'center'}>
        <View
          style={{
            flex: 0.75,
            width: '100%',
            backgroundColor: Color.secondComplementColor,
          }}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.subtitleText}>{appName}</Text>
          <View style={styles.lineSeparator} />
          <Text style={styles.titleText}>BIENVENUE CITOYEN</Text>
        </View>

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor={Color.firstDarkComplementColor}
          onPress={() => null}
          style={styles.buttonStart}>
          <>
            <Text style={styles.btnText}>DEMARRER</Text>
            <FontAwesomeIcon icon={faArrowRight} color={'white'} size={30} />
          </>
        </TouchableHighlight>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 15,
    paddingHorizontal: 30,
    width: '90%',
    height: 180,
    bottom: '15%',
    right: 0,
    position: 'absolute',
    backgroundColor: Color.secondColorBackground,
    borderBottomLeftRadius: 90,
    borderTopLeftRadius: 9,
  },
  titleText: {
    fontSize: 36,
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
  },
  subtitleText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 15,
    textAlign: 'left',
    color: 'white',
  },
  btnText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 21,
    textAlign: 'left',
    color: 'white',
  },
  lineSeparator: {
    marginTop: 9,
    marginVertical: 3,
    width: '36%',
    backgroundColor: 'white',
    height: 0.6,
  },
  buttonStart: {
    position: 'absolute',
    width: '60%',
    height: 81,
    borderWidth: 3,
    borderEndWidth: 0,
    borderColor: Color.secondColorBackground,
    right: 0,
    bottom: '8%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopLeftRadius: 90,
    borderBottomLeftRadius: 90,
    backgroundColor: Color.firstComplementColor,
  },
});

export default Welcome;

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {BackHandler, Text, View, StyleSheet} from 'react-native';

import {faCheck} from '@fortawesome/free-solid-svg-icons';

//LAYOUTS
import Container from '../../components/layout/Container';
import Space from '../../components/layout/Space';

//COMPONENTS
import ButtonLarge from '../../components/buttons/ButtonLarge';
import * as ProgressBar from 'react-native-progress';

//ICON
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

//CONSTANTS
import I18n from '../../i18n/i18n';
import * as Color from '../../components/config/color';

import {ScrollView} from 'react-native-gesture-handler';

class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingStop: false,
      loadingSyncDb: false,
    };
  }

  returnHome() {
    this.props.navigation.navigate('Home', {
      scanner: this.props.navigation.state.params.scanner,
    });
  }

  render() {
    let tsHour = new Date(
      this.props.navigation.state.params.timestamp * 1000,
    ).getHours();
    let tsMinutes = new Date(
      this.props.navigation.state.params.timestamp * 1000,
    ).getMinutes();
    if (tsMinutes < 10) {
      tsMinutes = '0' + tsMinutes;
    }

    return (
      <Container justifyContent={'center'} alignItems={'center'}>
        <Space size={30} />
        <View
          style={{
            justifyContent: 'center',
            height: 210,
            width: '90%',
            borderColor: 'lightgrey',
            borderWidth: 1,
            borderRadius: 30,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              padding: 15,
              borderColor: Color.secondColor,
              borderRadius: 60,
              borderWidth: 6,
            }}>
            <FontAwesomeIcon
              icon={faCheck}
              color={Color.secondColor}
              size={45}
            />
          </View>
          <Space size={30} />
          <Text
            style={{
              textAlign: 'center',
              color: 'black',
              paddingHorizontal: '18%',
            }}>
            {I18n.t('progress_congrat')}
          </Text>
        </View>

        <Space size={18} />

        <ProgressBar.Bar
          indeterminateAnimationDuration={9000}
          height={24}
          borderRadius={60}
          color={'black'}
          width={300}
          useNativeDriver={true}
          indeterminate={true}
          animationType={'spring'}
        />

        <Space size={18} />

        {/* INFOS SESSION DE CHARGE */}
        <View style={{marginLeft: '6%', paddingRight: '12%'}}>
          <Text style={{color: 'black'}}>
            {I18n.t('progress_state')}{' '}
            {this.props.navigation.state.params.borne.pseudo}
          </Text>
          <Space size={18} />
          <Text style={{color: 'black'}}>
            {I18n.t('progress_time')} : {tsHour}H{tsMinutes}
          </Text>
          <Space size={18} />
          <Text style={{color: 'black'}}>
            {'Session : ' + this.props.navigation.state.params.lastSessionID}
          </Text>
        </View>

        <Space size={18} />

        <View style={styles.shadowLine} />

        <Space size={21} />

        <Text style={styles.text}>{I18n.t('progress_explain_stop')}</Text>

        <Space size={15} />

        <ButtonLarge
          onPress={() => this.returnHome()}
          loading={this.state.loadingStop}
          title={I18n.t('progress_return_home')}
        />

        <Space size={15} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: '12%',
  },

  shadowLine: {
    height: 3,
    elevation: 3,
    width: '100%',
    shadowRadius: 1,
    shadowOpacity: 1,
    shadowColor: '#fff',
    borderBottomWidth: 0.1,
    shadowOffset: {width: 0, height: 6},
  },
});

export default Progress;

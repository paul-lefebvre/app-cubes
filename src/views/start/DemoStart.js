/* eslint-disable no-unused-vars */
import * as React from 'react';
import {StyleSheet, Text} from 'react-native';

//LAYOUTS
import * as Color from '../../components/config/color';
import Container from '../../components/layout/Container';
import Space from '../../components/layout/Space';
import ButtonLarge from '../../components/buttons/ButtonLarge';

//CONSTANTS
import I18n from '../../i18n/i18n';
import {versionApp} from '../../config/utils';

class DemoStart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: this.props.loadUser,
    };
  }

  _goBluetoothScreen() {
    this.props.navigation.navigate('Bluetooth');
  }

  render() {
    return (
      <Container justifyContent={'center'} alignItems={'center'}>
        <Text style={styles.text}>{I18n.t('demo_start')}</Text>

        <Space size={30} />

        <ButtonLarge
          onPress={() => this._goBluetoothScreen()}
          title={I18n.t('demo_start_btn')}
        />

        <Space size={18} />

        <Text>
          {I18n.t('demo_version_app')} {versionApp}
        </Text>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 19,
    maxWidth: '81%',
    textAlign: 'center',
    color: Color.secondColor,
  },
});

export default DemoStart;

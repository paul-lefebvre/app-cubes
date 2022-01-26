/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {Text, View, RefreshControl, StyleSheet, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//LAYOUTS
import Container from '../../components/layout/Container';
import Space from '../../components/layout/Space';
import NetInfo from '@react-native-community/netinfo';
import CounterLarge from '../../components/counters/CounterLarge';
import AlertAnimated from '../../components/alerts/AlertAnimated';

//ICON
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faChevronRight,
  faCoins,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';

//CONSTANTS
import I18n from '../../i18n/i18n';
import * as Color from '../../components/config/color';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ButtonUnfilled from '../../components/buttons/ButtonUnfilled';
import {versionApp} from '../../config/utils';

class Profil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      addedTokens: false,
      addedNbTokens: 0,
      haveInternet: false,
      offlineTokens: '...',
      refreshing: false,
    };
  }

  //RETRIEVE USER DATAS (OFFLINE WORK)
  async componentDidMount() {
    let user = JSON.parse(await AsyncStorage.getItem('user_profile'));
    this.setState({user: user});

    await NetInfo.fetch().then(async value => {
      if (value.isConnected) {
        this.setState({offlineTokens: this.state.user.tokenOffline});
        this.setState({haveInternet: true});
      } else {
        let actTokens = await AsyncStorage.getItem('offline_token');
        this.setState({offlineTokens: actTokens});
        this.setState({haveInternet: false});
      }
    });

    this._isMounted = true;
    if (this._isMounted) {
      this._unsubscribe = this.props.navigation.addListener(
        'didFocus',
        async () => {
          await this.refreshDatasView();
        },
      );
    }
  }

  async refreshDatasView() {
    console.log('[INFO] REFRESHING DATA VIEW');
    let user = JSON.parse(await AsyncStorage.getItem('user_profile'));
    this.setState({user: user});
    let haveInternet = await NetInfo.fetch().then(value => {
      return value.isConnected;
    });

    let offlineTokens = await AsyncStorage.getItem('offline_token');
    this.setState({haveInternet: haveInternet});

    if (this.state.haveInternet) {
      if (this.state.user.tokenOffline > offlineTokens) {
        let diffNbTokens = this.state.user.tokenOffline - offlineTokens;
        this.setState({addedTokens: true});
        this.setState({addedNbTokens: diffNbTokens});
      }
      //CALL API TO KNOW HOW MUCH FOR THIS CLIENT (or refresh client data for)
      let responseTokensAPI = this.state.user.tokenOffline;
      this.state.user.tokenOffline = responseTokensAPI;
      await AsyncStorage.setItem(
        'user_profile',
        JSON.stringify(this.state.user),
      );
      await AsyncStorage.setItem('offline_token', '2');
      this.setState({offlineTokens: responseTokensAPI});
    } else {
      this.setState({offlineTokens: offlineTokens});
    }
  }

  goHistoryUser() {
    this.props.navigation.navigate('History');
  }

  goReportBug() {
    this.props.navigation.navigate('Report');
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async logout() {
    await AsyncStorage.multiRemove(['id_token', 'user_profile']);
    this.props.navigation.navigate('Start');
  }

  render() {
    const state = this.state;
    return (
      <Container justifyContent={'center'} alignItems={'center'}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing}
              tintColor={Color.secondColor}
              colors={['white']}
              progressBackgroundColor={Color.secondColor}
              onRefresh={this.refreshDatasView.bind(this)}
            />
          }
          style={{flex: 1, width: '100%'}}
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Space size={9} />

          <View style={styles.headerText}>
            <View style={styles.viewAccount}>
              <Space size={42} />
              <Text style={styles.titleAccount}>Mon compte</Text>
              <Space size={9} />
              <Text style={styles.textAccount}>
                {state.user ? state.user.firstname : ''}{' '}
                {state.user ? state.user.name : ''}
              </Text>
              <Text style={styles.textAccount}>
                {state.user ? state.user.email : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.logout()}>
              <Text style={styles.logoutText}>Me déconnecter</Text>
            </TouchableOpacity>
          </View>

          <Space size={45} />
          <CounterLarge
            description={'Jetons de charge hors-ligne restants'}
            infos={
              "Les Jetons permettent d'effectuer des charges sans réseau WI-FI.\n\n" +
              'Connectez-vous à Internet pour récupérer de nouveaux jetons.'
            }
            icon={faCoins}
            number={state.offlineTokens}
          />
          <Space size={30} />
          <ButtonUnfilled
            onPress={() => this.goHistoryUser()}
            title={'Mon historique'}
            disabled={state.haveInternet ? false : true}
            iconColor={state.haveInternet ? 'black' : 'lightgrey'}
            icon={state.haveInternet ? faChevronRight : faWifi}
          />
          <Space size={30} />
          <ButtonUnfilled
            onPress={() => this.goReportBug()}
            title={'Boite de Réception'}
            disabled={state.haveInternet ? false : true}
            iconColor={state.haveInternet ? 'black' : 'lightgrey'}
            icon={state.haveInternet ? faChevronRight : faWifi}
          />
          <Text style={{position: 'absolute', bottom: 9}}>
            Version {versionApp}
          </Text>
        </ScrollView>
        <AlertAnimated
          displayAlert={this.state.addedTokens}
          alertTitleText={'Félicitation !'}
          displayAlertIcon={false}
          alertMessageText={
            'Vous venez de recevoir ' +
            this.state.addedNbTokens +
            ' jetons de charge hors-ligne.'
          }
          displayPositiveButton={true}
          positiveButtonText={'OK'}
          displayNegativeButton={false}
          onPressPositiveButton={() => this.setState({addedTokens: false})}
        />
      </Container>
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
  viewAccount: {
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
  logoutText: {
    textDecorationLine: 'underline',
  },
});

export default Profil;

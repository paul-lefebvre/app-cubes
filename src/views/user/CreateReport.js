/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {Text, View, StyleSheet, Platform, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//LAYOUTS
import Container from '../../components/layout/Container';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Space from '../../components/layout/Space';

//COMPONENTS
import InputText from '../../components/inputs/InputText';
import Infos from '../../components/infos/Infos';

//CONSTANTS
import I18n from '../../i18n/i18n';
import * as Color from '../../components/config/color';

import {KEY_SUPPORT, SUPPORT_URL} from '../../config/utils';
import ButtonLarge from '../../components/buttons/ButtonLarge';

class CreateReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      subject: '',
      message: '',
      messageIsWrong: null,
      subjectIsWrong: null,
      loading: false,
    };
  }

  async componentDidMount() {
    let user = JSON.parse(await AsyncStorage.getItem('user_profile'));
    this.setState({user: user});
  }

  async createTicket() {
    this.setState({loading: true});
    if (this.state.messageIsWrong || this.state.subjectIsWrong) {
      this.setState({loading: false});
      return;
    }
    try {
      let response = await fetch(
        SUPPORT_URL + '/api/conversations?api_key=' + KEY_SUPPORT,
        {
          method: 'POST',
          headers: {
            Accept: 'application/hal+json',
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            type: 'email',
            mailboxId: 1,
            subject: this.state.subject,
            customer: {
              email: this.state.user.email,
            },
            threads: [
              {
                text: this.state.message,
                type: 'customer',
                customer: {
                  email: this.state.user.email,
                  firstName: this.state.user.firstname,
                  lastName: this.state.user.name,
                },
              },
            ],
          }),
        },
      )
        .then(res => res.json())
        .then(async function (result) {
          return result;
        });
      if (response.state === 'published') {
        this.props.navigation.navigate('Report', {reloadView: true});
      }
    } catch (error) {
      console.log('[ERROR]', error);
    }
    this.setState({loading: false});
    return;
  }

  onSubjectChange(value) {
    this.setState({subject: value});
    if (value === '' || value === ' ' || value == null) {
      this.setState({subjectIsWrong: true});
    } else {
      this.setState({subjectIsWrong: false});
    }
  }

  onMessageChange(value) {
    this.setState({message: value});
    if (value === '' || value === ' ' || value == null) {
      this.setState({messageIsWrong: true});
    } else {
      this.setState({messageIsWrong: false});
    }
  }

  render() {
    const state = this.state;
    let smallScreen;
    let heightScreen = Dimensions.get('window').height;
    heightScreen / 2 < 300 ? (smallScreen = true) : false;
    return (
      <KeyboardAwareScrollView
        scrollEnabled={Platform.OS === 'ios' ? true : true}
        keyboardOpeningTime={0}
        viewIsInsideTabBar={true}
        enableOnAndroid={false}
        extraScrollHeight={
          smallScreen ? heightScreen / 2.1 - 80 : heightScreen / 2 - 80
        }
        enableAutomaticScroll={true}
        ref={ref => {
          this.scroll = ref;
        }}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        style={{backgroundColor: 'white'}}>
        <Space size={18} />
        <Text style={styles.titleAccount}>CONTACTER NOTRE SUPPORT</Text>
        <Space size={30} />
        <Infos
          displayInfos={true}
          text={
            "Faites nous part d'un problème rencontré lors de l'utilisation de YouBorne. Notre support vous répondra dans les plus brefs délais."
          }
        />
        <Space size={30} />
        <InputText
          placeholder={'Objet *'}
          value={this.state.subject}
          wrong={this.state.subjectIsWrong}
          onValueChange={value => this.onSubjectChange(value)}
        />
        <Space size={30} />
        <InputText
          placeholder={'Rédigez votre message au support. *'}
          isTextInput={true}
          value={this.state.message}
          wrong={this.state.messageIsWrong}
          onValueChange={value => this.onMessageChange(value)}
        />
        <Space size={30} />
        <ButtonLarge
          loading={state.loading}
          onPress={this.createTicket.bind(this)}
          title={'Valider'}
        />
      </KeyboardAwareScrollView>
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
    fontSize: 18,
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

export default CreateReport;

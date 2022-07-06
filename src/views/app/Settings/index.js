/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import styles from './style';
import {NeomorphFlex} from 'react-native-neomorph-shadows';

//CONSTANTS
import {API_URL} from '../../../config/utils';
import refreshUser from '../../../functions/refreshUser';

//LAYOUTS
import * as Color from '../../../components/config/color';
import Container from '../../../components/layout/Container';
import ButtonLarge from '../../../components/buttons/ButtonLarge';
import InputText from '../../../components/inputs/InputText';
import Space from '../../../components/layout/Space';

//ICON
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

//PACKAGES
import I18n from '../../../i18n/i18n';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-community/async-storage';
import Avatar from '../../../components/avatar/Avatar';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      mail: '',
      pseudo: '',
      firstname: '',
      lastname: '',
      errorMsg: '',
      wrongMail: null,
      validMsg: '',
    };
  }

  async componentWillMount() {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    this.setState({
      user: user,
    });
  }

  headerRender() {
    const state = this.state;
    return (
      <View style={styles.header}>
        <Space width={30} />
        <TouchableOpacity
          onPress={() => this.goBack()}
          style={styles.button}
          activeOpacity={0.6}>
          <FontAwesomeIcon icon={faArrowLeft} size={27} color={'white'} />
        </TouchableOpacity>
        <Text style={styles.pseudo}>Paramètres</Text>
      </View>
    );
  }

  updatePseudo(value) {
    this.setState({pseudo: value});
  }

  updateFirstname(value) {
    this.setState({firstname: value});
  }

  updateLastname(value) {
    this.setState({lastname: value});
  }

  updateMail(value) {
    this.setState({mail: value});
    if (
      !value ||
      value === '' ||
      value.includes(' ') ||
      !value.includes('@') ||
      !value.includes('.')
    ) {
      this.setState({wrongMail: true});
    } else {
      this.setState({wrongMail: false});
    }
  }

  async updateUser() {
    console.log(this.state.user.usr_id);
    if (
      !this.state.mail &&
      !this.state.firstname &&
      !this.state.lastname &&
      !this.state.pseudo
    ) {
      this.setState({
        errorMsg:
          'Veuillez modifier une de vos informations afin de confirmer.',
      });
      return;
    }

    let result = await fetch(API_URL + '/api/users/' + this.state.user.usr_id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pseudo: this.state.pseudo ? this.state.pseudo : this.state.user.pseudo,
        firstname: this.state.firstname
          ? this.state.firstname
          : this.state.user.firstname,
        lastname: this.state.lastname
          ? this.state.lastname
          : this.state.user.lastname,
        mail: this.state.mail ? this.state.mail : this.state.user.mail,
      }),
    }).then(res => {
      return res;
    });

    if (result.ok) {
      this.setState({validMsg: 'Modifications effectuées'});
      await refreshUser(this.state.user.usr_id);
    }
  }

  async logout() {
    await AsyncStorage.removeItem('jwt');
    await AsyncStorage.removeItem('user');
    this.props.navigation.push('SignUpPage', {indexPage: 0});
  }

  async goBack() {
    try {
      await refreshUser(this.state.user.usr_id);
    } catch (err) {
      console.log(err);
    }
    this.props.navigation.navigate('Profil', {needRefresh: true});
  }

  render() {
    const state = this.state;
    let heightScreen = Dimensions.get('window').height;
    let widthScreen = Dimensions.get('window').width;
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={-heightScreen / 2.5}
        style={styles.container}
        behavior="height">
        {this.headerRender()}
        <Container
          backgroundColor={Color.colorBackground}
          justifyContent={'flex-start'}
          alignItems={'center'}>
          <Space size={30} />

          <NeomorphFlex
            useArt
            style={styles.cardContainer}
            darkShadowColor="#FFFFFF"
            lightShadowColor="#D1CDC7">
            <Space size={9} />
            <Text style={styles.smallText}>Informations Personnelles</Text>
            <Space size={18} />
            <InputText
              onValueChange={pseudo => {
                this.updatePseudo(pseudo);
              }}
              placeholder={state.user.pseudo}
              content={state.user.pseudo}
            />
            <Space size={12} />
            <InputText
              onValueChange={firstname => {
                this.updateFirstname(firstname);
              }}
              placeholder={state.user.firstname}
              content={state.user.firstname}
            />
            <Space size={12} />
            <InputText
              onValueChange={lastname => {
                this.updateLastname(lastname);
              }}
              placeholder={state.user.lastname}
              content={state.user.lastname}
            />
            <Space size={12} />
            <InputText
              onValueChange={mail => {
                this.updateMail(mail);
              }}
              placeholder={state.user.mail}
              content={state.user.mail}
              isMailInput
              wrong={state.wrongMail}
            />
            <Space size={12} />
            <Text style={styles.errorMsg}>
              {this.state.errorMsg ? this.state.errorMsg : ''}
            </Text>
            <ButtonLarge
              style={{
                width: '75%',
                height: 60,
                bottom: -12,
                backgroundColor: Color.blue,
              }}
              title="Modifier"
              onPress={this.updateUser.bind(this)}
            />
          </NeomorphFlex>

          <Space size={160} />
          <ButtonLarge title="Déconnexion" onPress={this.logout.bind(this)} />
          <Space size={30} />
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

export default Settings;

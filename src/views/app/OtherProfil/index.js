/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
  PermissionsAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import styles from './style';

//CONSTANTS
import {API_URL} from '../../../config/utils';

//LAYOUTS
import * as Color from '../../../components/config/color';
import Container from '../../../components/layout/Container';
import ButtonLarge from '../../../components/buttons/ButtonLarge';
import DropDownPicker from 'react-native-dropdown-picker';
import Space from '../../../components/layout/Space';
import PostCard from '../../../components/cards/PostCard';

//ICON
import {faArrowLeft, faShare} from '@fortawesome/free-solid-svg-icons';

//PACKAGES
import I18n from '../../../i18n/i18n';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-community/async-storage';
import Avatar from '../../../components/avatar/Avatar';
import InputText from '../../../components/inputs/InputText';
import Dialog, {DialogContent, SlideAnimation} from 'react-native-popup-dialog';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';

class OtherProfil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      refreshing: false,
      publications: [],
      profil: this.props.navigation.state.params.user
        ? this.props.navigation.state.params.user
        : null,
    };
  }

  async componentWillMount() {
    await this.getUser();
    await this.getPublications();
  }

  async getUser() {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    this.setState({
      user: user,
    });
  }

  async getPublications() {
    let publications = await fetch(API_URL + '/api/ressources', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        return res;
      });
    this.setState({publications: publications});
  }

  async onRefresh() {
    await this.getPublications();
  }

  headerRender() {
    const state = this.state;
    return (
      <View style={styles.header}>
        <Space width={30} />
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('TimeLine')}
          style={styles.button}
          activeOpacity={0.6}>
          <FontAwesomeIcon icon={faArrowLeft} size={27} color={'white'} />
        </TouchableOpacity>
        <Text style={styles.pseudo}>
          {state.profil
            ? state.profil.firstname + ' ' + state.profil.lastname
            : ''}
        </Text>
      </View>
    );
  }

  renderPosts() {
    let alreadyNonDisplayed = false;
    return this.state.publications.map(item => {
      if (item.resOwner) {
        let ownPost =
          item.resOwner.usr_id === this.state.profil.usr_id ? true : false;
        if (ownPost) {
          return (
            <>
              <PostCard
                id={item.res_id}
                ownPost={ownPost}
                owner={item.resOwner}
                user={this.state.profil}
                firstname={item.resOwner.firstname}
                lastname={item.resOwner.lastname}
                answers={item.answers}
                comments={item.comments}
                category={item.category}
                url={item.media ? item.media.path : null}
                ressource={item}
                nav={this.props.navigation}
              />
              <Space size={30} />
            </>
          );
        }
      }
    });
  }

  render() {
    const state = this.state;
    let heightScreen = Dimensions.get('window').height;
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
          <View style={styles.profilContainer}>
            <Space width={9} />
            <Avatar
              url={
                state.profil
                  ? API_URL +
                    '/public/upload/images/avatar/' +
                    state.profil.avatar_img
                  : null
              }
              style={{width: 81, height: 81}}
              styleImg={{width: 81, height: 81}}
            />
            <View style={styles.statContainer}>
              <Text style={styles.numbers}>
                {state.profil.publications
                  ? state.profil.publications.length
                  : '?'}
              </Text>
              <Text style={styles.smallText}>Publications</Text>
            </View>

            <View style={styles.statContainer}>
              <Text style={styles.numbers}>
                {state.profil.publications
                  ? state.profil.abonnements.length
                  : '?'}
              </Text>
              <Text style={styles.smallText}>Abonnements</Text>
            </View>
            <View style={styles.statContainer}>
              <Text style={styles.numbers}>
                {state.profil.publications ? state.profil.abonnes.length : '?'}
              </Text>
              <Text textBreakStrategy="highQuality" style={styles.smallText}>
                Abonnés
              </Text>
            </View>
          </View>

          <Space size={30} />

          <ScrollView
            style={{
              flex: 1,
              width: '100%',
            }}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
            refreshControl={
              <RefreshControl
                enabled
                size={'large'}
                refreshing={state.refreshing}
                colors={[Color.darkMagenta]}
                onRefresh={this.getPublications.bind(this)}
              />
            }>
            <Space size={30} />
            {state.publications.length > 0 ? this.renderPosts() : null}
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

export default OtherProfil;

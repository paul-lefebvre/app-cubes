/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import styles from './style';

//CONSTANTS
import {API_URL, appName} from '../../../config/utils';

//LAYOUTS
import * as Color from '../../../components/config/color';
import Container from '../../../components/layout/Container';
import ButtonLarge from '../../../components/buttons/ButtonLarge';
import PostCard from '../../../components/cards/PostCard';
import Space from '../../../components/layout/Space';

//ICON
import {faCog} from '@fortawesome/free-solid-svg-icons';
import {faPlusSquare} from '@fortawesome/free-regular-svg-icons';

//PACKAGES
import I18n from '../../../i18n/i18n';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-community/async-storage';
import Avatar from '../../../components/avatar/Avatar';

class Profil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      refreshing: false,
      publications: [],
    };
  }

  async componentWillMount() {
    await this.getUser();
    await this.getPublications();
  }

  async componentWillReceiveProps() {
    await this.getUser();
  }

  async getUser() {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    this.setState({
      user: user,
    });
  }

  headerRender() {
    const state = this.state;
    return (
      <View style={styles.header}>
        <Text style={styles.pseudo}>{state.user ? state.user.pseudo : ''}</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.push('NewPost')}
          style={styles.button}
          activeOpacity={0.6}>
          <FontAwesomeIcon icon={faPlusSquare} size={27} color={'white'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.push('Settings')}
          style={styles.button}
          activeOpacity={0.6}>
          <FontAwesomeIcon icon={faCog} size={27} color={'white'} />
        </TouchableOpacity>
      </View>
    );
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

  renderPosts() {
    let alreadyNonDisplayed = false;
    return this.state.publications.map(item => {
      if (item.resOwner) {
        let ownPost =
          item.resOwner.usr_id === this.state.user.usr_id ? true : false;
        if (ownPost) {
          return (
            <>
              <PostCard
                id={item.res_id}
                ownPost={ownPost}
                owner={item.resOwner}
                user={this.state.user}
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
        } else if (!alreadyNonDisplayed) {
          alreadyNonDisplayed = true;
          return (
            <>
              <Space size={30} />
              <Text
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 21,
                  backgroundColor: Color.blue,
                  color: 'white',
                  borderRadius: 9,
                  padding: 30,
                }}>
                Vous n'avez pas encore de publications.
              </Text>
            </>
          );
        }
      }
    });
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
          <View style={styles.profilContainer}>
            <Space width={9} />
            <Avatar
              url={
                state.user
                  ? API_URL +
                    '/public/upload/images/avatar/' +
                    state.user.avatar_img
                  : null
              }
              style={{width: 81, height: 81}}
              styleImg={{width: 81, height: 81}}
            />
            <View style={styles.statContainer}>
              <Text style={styles.numbers}>
                {state.user ? state.user.publications.length : '?'}
              </Text>
              <Text style={styles.smallText}>Publications</Text>
            </View>

            <View style={styles.statContainer}>
              <Text style={styles.numbers}>
                {state.user ? state.user.abonnements.length : '?'}
              </Text>
              <Text style={styles.smallText}>Abonnements</Text>
            </View>
            <View style={styles.statContainer}>
              <Text style={styles.numbers}>
                {state.user ? state.user.abonnes.length : '?'}
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

export default Profil;

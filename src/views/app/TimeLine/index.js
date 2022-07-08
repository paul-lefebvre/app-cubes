/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  RefreshControl,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import styles from './style';
import Fade from '../../../components/anim/Fade';
import {NeomorphFlex} from 'react-native-neomorph-shadows';

//PACKAGES
import Swiper from 'react-native-swiper';

//FUNCTIONS
import suggest from '../../../functions/suggest';

//LAYOUTS
import * as Color from '../../../components/config/color';
import Container from '../../../components/layout/Container';
import ButtonLarge from '../../../components/buttons/ButtonLarge';

import Space from '../../../components/layout/Space';
import InputText from '../../../components/inputs/InputText';
import BigTitle from '../../../components/texts/BigTitle';

//ICON
import {faEnvelopeSquare} from '@fortawesome/free-solid-svg-icons';
import {faBell, faPlusSquare} from '@fortawesome/free-regular-svg-icons';
import LottieView from 'lottie-react-native';

//CONSTANTS
import I18n from '../../../i18n/i18n';
import {API_URL, appName} from '../../../config/utils';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {ScrollView} from 'react-native-gesture-handler';
import InputSearch from '../../../components/inputs/InputSearch';
import SmallUserCard from '../../../components/cards/SmallUserCard';
import PostCard from '../../../components/cards/PostCard';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Dialog, {
  DialogContent,
  DialogTitle,
  SlideAnimation,
} from 'react-native-popup-dialog';

class TimeLine extends React.Component {
  constructor(props) {
    super(props);
    this.swiper = React.createRef();
    this.state = {
      user: null,
      isFirstConn: false,
      suggests: null,
      publications: [],
      refreshing: false,
      userSub: null,
      openDropdown: false,
      valueRelation: null,
      relations: [
        {
          label: 'Ami',
          value: 0,
        },
      ],
    };
  }

  setOpenDropdown(open) {
    this.setState({openDropdown: open});
  }

  setValue(callback) {
    this.setState(state => ({valueRelation: callback(state.valueRelation)}));
  }

  setItems(callback) {
    this.setState(state => ({relations: callback(state.relations)}));
  }

  async componentDidMount() {
    const suggests = await suggest();
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    this.setState({
      user: user,
      subscribeModal: false,
      suggests: suggests,
    });

    await this.getPublications();
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

  skipSurround() {
    this.setState({isFirstConn: false});
  }

  headerRender() {
    const state = this.state;
    return (
      <View style={styles.header}>
        <Text style={styles.appName}>{appName}</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.push('NewPost')}
          style={styles.button}
          activeOpacity={0.6}>
          <FontAwesomeIcon icon={faPlusSquare} size={27} color={'white'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => null}
          style={styles.button}
          activeOpacity={0.6}>
          <FontAwesomeIcon icon={faBell} size={27} color={'white'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => null}
          style={styles.button}
          activeOpacity={0.6}>
          <FontAwesomeIcon icon={faEnvelopeSquare} size={27} color={'white'} />
        </TouchableOpacity>
      </View>
    );
  }

  firstConnAddFriendsRender() {
    const state = this.state;
    return (
      <Fade visible={state.isFirstConn}>
        <Space size={30} />
        <NeomorphFlex
          lightShadowColor="white"
          darkShadowColor="#D1CDC7"
          style={styles.firstConnContainer}>
          <Space size={21} />
          <LottieView
            source={require('../../../assets/lotties/btn_add_pulse.json')}
            autoPlay
            loop
            resizeMode={'cover'}
            style={styles.addPulseIcon}
          />
          <Space size={30} />
          <BigTitle text={'BIENVENUE !'} />
          <Text style={{paddingHorizontal: 30}}>
            Commencez par ajouter de nouvelles personnes ou invitez des
            connaissances !
          </Text>

          <Space size={21} />
          <ButtonLarge
            onPress={() => this.props.navigation.push('Surround')}
            title={'Inviter son entourage'}
          />
          <Space size={12} />
          <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => this.skipSurround()}>
            <Text
              style={{
                paddingHorizontal: 30,
                textDecorationLine: 'underline',
                color: 'grey',
              }}>
              Plus tard
            </Text>
          </TouchableOpacity>

          <Space size={21} />
        </NeomorphFlex>
      </Fade>
    );
  }

  async subscribeUser(user) {
    this.setState({subscribeModal: true});
    this.setState({userSub: user});
  }

  async subscribeFriend(user) {
    const result = await fetch(API_URL + '/api/relations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        follower_id: this.state.user.usr_id,
        followed_id: user.usr_id,
      }).then(res => {
        return res;
      }),
    });
    this.setState({subscribeModal: false});
    this.setState({userSub: null});
    const suggests = await suggest();
    this.setState({suggests: suggests});
  }

  renderSuggests() {
    return this.state.suggests.map((item, index) => {
      let isFollowed = false;
      if (item.usr_id !== this.state.user.usr_id) {
        item.abonnements.map(abonnement => {
          if (abonnement.follower_id === this.state.user.usr_id) {
            isFollowed = true;
            console.log('abonné');
          }
        });
        return (
          <SmallUserCard
            firstname={item.firstname}
            lastname={item.lastname}
            pseudo={item.pseudo}
            isFollowed={isFollowed}
            onSubscribe={() => this.subscribeUser(item)}
            onPress={() => {
              this.props.navigation.push('OtherProfil', {user: item});
            }}
            url={
              item.avatar_img
                ? API_URL + '/public/upload/images/avatar/' + item.avatar_img
                : '/public/upload/images/avatar/unknown.png'
            }
          />
        );
      }
    });
  }

  renderPosts() {
    return this.state.publications.map(item => {
      if (item.resOwner) {
        let ownPost =
          item.resOwner.usr_id === this.state.user.usr_id ? true : false;
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
      }
    });
  }

  async onRefresh() {
    await this.getPublications();
  }

  render() {
    const state = this.state;
    const propsNav = this.props.navigation.state.params;

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
          scrollEnabled={false}
          alignItems={'center'}>
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
            <InputSearch placeholder={'Rechercher'} />
            {this.firstConnAddFriendsRender()}
            <Space size={30} />
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.addFriendsContentContainer}
              style={styles.addFriendsContainer}>
              {state.suggests ? this.renderSuggests() : null}
            </ScrollView>
            <Space size={30} />
            {state.publications.length > 0 ? this.renderPosts() : null}
          </ScrollView>
        </Container>
        <Dialog
          visible={this.state.subscribeModal}
          dialogAnimation={
            new SlideAnimation({
              slideFrom: 'bottom',
            })
          }
          dialogStyle={{width: '90%'}}
          onTouchOutside={() => {
            this.setState({subscribeModal: false});
          }}>
          <DialogContent>
            <Space size={12} />
            <Text style={{fontWeight: 'bold', fontSize: 21, color: 'black'}}>
              {state.userSub
                ? state.userSub.firstname + ' ' + state.userSub.lastname
                : ''}
            </Text>
            <Space size={30} />
            <Text style={styles.smallText}>Séléctionnez votre relation</Text>
            <Space size={12} />
            <DropDownPicker
              zIndex={9999}
              open={state.openDropdown}
              value={state.valueRelation}
              items={state.relations}
              placeholderStyle={{
                color: 'grey',
                fontWeight: 'bold',
              }}
              containerStyle={{maxWidth: '90%'}}
              placeholder={'Séléctionner une relation'}
              setOpen={this.setOpenDropdown.bind(this)}
              setValue={this.setValue.bind(this)}
              setItems={this.setItems.bind(this)}
            />
            <Space size={90} />
            <ButtonLarge
              title={"S'abonner"}
              style={{width: '90%'}}
              onPress={() => this.subscribeFriend.bind(this)}
            />
          </DialogContent>
        </Dialog>
      </KeyboardAvoidingView>
    );
  }
}

export default TimeLine;

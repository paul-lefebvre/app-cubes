/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import styles from './style';
import Fade from '../../../components/anim/Fade';
import {NeomorphFlex} from 'react-native-neomorph-shadows';

//PACKAGES
import Swiper from 'react-native-swiper';

//LAYOUTS
import * as Color from '../../../components/config/color';
import Container from '../../../components/layout/Container';
import ButtonLarge from '../../../components/buttons/ButtonLarge';

import Space from '../../../components/layout/Space';
import InputText from '../../../components/inputs/InputText';
import BigTitle from '../../../components/texts/BigTitle';

//ICON
import {faBars, faEnvelopeSquare} from '@fortawesome/free-solid-svg-icons';
import LottieView from 'lottie-react-native';

//CONSTANTS
import I18n from '../../../i18n/i18n';
import {appName} from '../../../config/utils';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {ScrollView} from 'react-native-gesture-handler';
import InputSearch from '../../../components/inputs/InputSearch';
import SmallUserCard from '../../../components/cards/SmallUserCard';

class TimeLine extends React.Component {
  constructor(props) {
    super(props);
    this.swiper = React.createRef();
    this.state = {
      isFirstConn: true,
    };
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
          onPress={() => null}
          style={styles.button}
          activeOpacity={0.6}>
          <FontAwesomeIcon icon={faBars} size={27} color={'white'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => null}
          style={styles.button}
          activeOpacity={0.6}>
          <FontAwesomeIcon icon={faEnvelopeSquare} size={30} color={'white'} />
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

  render() {
    const state = this.state;
    const propsNav = this.props.navigation.state.params;

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
          scrollEnabled={true}
          alignItems={'center'}>
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
            <SmallUserCard
              firstname={'Paul'}
              lastname={'Lefebvre'}
              pseudo={'-'}
            />
            <SmallUserCard
              firstname={'Paul'}
              lastname={'Lefebvre'}
              pseudo={'-'}
            />
            <SmallUserCard
              firstname={'Paul'}
              lastname={'Lefebvre'}
              pseudo={'-'}
            />
          </ScrollView>
          <Space size={1000} />
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

export default TimeLine;

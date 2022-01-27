/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import styles from './style';

import Swiper from 'react-native-swiper';

//LAYOUTS
import * as Color from '../../../components/config/color';
import Container from '../../../components/layout/Container';
import InputText from '../../../components/inputs/InputText';
import Space from '../../../components/layout/Space';

//CONSTANTS
import I18n from '../../../i18n/i18n';
import {appName} from '../../../config/utils';

class Discover extends React.Component {
  constructor(props) {
    super(props);
    this.swiper = React.createRef();
    this.state = {
      firstname: '',
      lastname: '',
      stepBoarding: 0,
    };
  }

  nextStep() {
    if (this.state.firstname != '' && this.state.firstname.length > 2) {
      this.swiper.current.scrollTo(1, true);
      this.setState({stepBoarding: 1});
    }

    if (this.state.lastname != '' && this.state.lastname.length > 2) {
      this.props.navigation.navigate('SignUpPage', {
        indexPage: 1,
        lastname: this.state.lastname,
        firstname: this.state.firstname,
      });
    }
  }

  updateFirstname(value) {
    this.setState({firstname: value});
  }

  updateLastname(value) {
    this.setState({lastname: value});
  }

  renderCard() {
    const state = this.state;
    return (
      <>
        <View style={styles.cardContainer}>
          <View style={styles.imgCardContainer}>
            <Image
              style={styles.imgCard}
              source={require('../../../assets/img/boarding/welcome1.png')}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleCard}>
              {state.stepBoarding === 1 ? 'Continuez !' : "C'est parti !"}
            </Text>
            <Space size={21} />
            <InputText
              style={styles.inputCard}
              onValueChange={value =>
                state.stepBoarding
                  ? this.updateLastname(value)
                  : this.updateFirstname(value)
              }
              placeholder={
                state.stepBoarding === 1 ? 'VOTRE NOM' : 'VOTRE PRÉNOM'
              }
              placeHolderColor={'gray'}
            />
            <Space size={3} />
            <Text style={styles.textCard}>
              Renseignez votre {state.stepBoarding === 1 ? 'nom' : 'prénom'} et
              commencez à découvrir {appName}.
            </Text>
          </View>
        </View>
        <View style={styles.firstShadow} />
        <View style={styles.secondShadow} />
      </>
    );
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
        <Container
          backgroundColor={Color.thirdColorBackground}
          justifyContent={'flex-start'}
          alignItems={'center'}>
          <Space size={60} />
          <Swiper
            ref={this.swiper}
            index={state.stepBoarding}
            loop={false}
            scrollEnabled={false}
            showsPagination={false}
            width={widthScreen}
            containerStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.renderCard()}
            {this.renderCard()}
          </Swiper>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => this.nextStep()}
            style={styles.buttonStart}>
            <>
              <Text style={styles.btnText}>CONTINUER</Text>
            </>
          </TouchableOpacity>
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

export default Discover;

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  Dimensions,
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

//ICON
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

//PACKAGES
import I18n from '../../../i18n/i18n';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-community/async-storage';
import Avatar from '../../../components/avatar/Avatar';
import InputText from '../../../components/inputs/InputText';
import Dialog, {DialogContent, SlideAnimation} from 'react-native-popup-dialog';

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      newComment: '',
      published: false,
      ressource: this.props.navigation.state.params.ressource
        ? this.props.navigation.state.params.ressource
        : null,
    };
  }

  async componentWillMount() {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    this.setState({
      user: user,
    });
  }

  /**
   *  create new comment or comment's response
   */
  async createComment() {

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
        <Text style={styles.pseudo}>Commentaires</Text>
      </View>
    );
  }

  updateNewComment(value) {
    this.setState({newComment: value});
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
          scrollEnabled
          backgroundColor={Color.colorBackground}
          justifyContent={'flex-start'}
          alignItems={'center'}>
          <Space size={30} />
          <InputText
            isTextInput
            onValueChange={text => {
              this.updateNewComment(text);
            }}
            value={this.state.newComment}
            placeholder={'Ecrire un commentaire...'}
          />
          <Space size={30} />
          <Text style={styles.errorMsg}>
            {this.state.errorMsg ? this.state.errorMsg : ''}
          </Text>
          <Space size={20} />
          <ButtonLarge
            title="Répondre"
            onPress={this.createComment.bind(this)}
          />
          <Space size={30} />
        </Container>
        <Dialog
          visible={this.state.published}
          dialogAnimation={
            new SlideAnimation({
              slideFrom: 'bottom',
            })
          }
          onTouchOutside={() => {
            this.setState({published: false});
          }}>
          <DialogContent>
            <Space size={12} />
            <Text style={styles.title}>Félicitation!</Text>
            <Space size={30} />
            <Text style={styles.smallText}>
              Votre commentaire a bien été envoyé
            </Text>
            <Space size={12} />
          </DialogContent>
        </Dialog>
      </KeyboardAvoidingView>
    );
  }
}

export default Comments;

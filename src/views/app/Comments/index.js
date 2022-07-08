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

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      newComment: '',
      published: false,
      ressource: this.props.navigation.state.params.ressource
        ? this.props.navigation.state.params.ressource
        : [],
      loading: true,
      newResponse: '',
    };
  }

  async componentWillMount() {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    this.setState({
      user: user,
    });

    if (this.state.ressource) {
      let ressource = this.state.ressource;
      await ressource.comments.map(async (comment, index) => {
        ressource.comments[index].owner = await fetch(
          API_URL + '/api/users/' + comment.id_owner,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
          .then(res => res.json())
          .then(res => {
            return res;
          });
      });
    }
  }

  /**
   *  create new comment or comment's response
   */
  async createComment() {
    try {
      let res = await fetch(API_URL + '/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          res_id: this.state.ressource.res_id,
          answers: this.state.newComment,
          id_owner: this.state.user.usr_id,
          is_response: 0,
        }),
      }).then(res => {
        return res;
      });
      if (res.ok) {
        this.setState({published: true});
        setTimeout(() => {
          this.setState({published: false});
        }, 5000);
        setTimeout(() => {
          this.props.navigation.navigate('TimeLine');
        }, 7000);
      }
    } catch (err) {
      console.log(err);
    }
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

  renderCurrentComments() {
    let responses = [];
    let comments = this.state.ressource.comments;

    return comments.map(comment => {
      comments.map(response => {
        if (
          response.is_response === 1 &&
          response.id_response_to_usr === comment.com_id &&
          response.com_id !== comment.com_id
        ) {
          responses.push(response);
        }
      });
      if (comment.is_response === 0) {
        return (
          <View style={styles.comment}>
            <Space size={3} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Avatar />
              <Space width={12} />
              <Text style={styles.title}>
                {comment.owner ? comment.owner.firstname : ''}{' '}
                {comment.owner ? comment.owner.lastname : ''}
              </Text>
              <Space width={3} />
              <Text
                style={{
                  backgroundColor: Color.blue,
                  color: 'white',
                  padding: 4,
                  borderRadius: 9,
                }}>
                {comment.owner ? comment.owner.pseudo : ''}
              </Text>
            </View>
            <Space size={9} />
            <Text
              style={[
                styles.smallText,
                {
                  fontSize: 18,
                  borderRadius: 6,
                  paddingVertical: 12,
                  backgroundColor: Color.colorBackground,
                },
              ]}>
              {comment.answers}
            </Text>
            <Space size={12} />
            {responses.length > 0
              ? responses.map(response => (
                  <View
                    style={{
                      marginLeft: 21,
                      paddingHorizontal: 12,
                      alignItems: 'center',
                      borderRadius: 12,
                      backgroundColor: Color.colorBackground,
                      flexDirection: 'row',
                    }}>
                    <FontAwesomeIcon
                      color={Color.darkBlue}
                      size={12}
                      icon={faShare}
                    />
                    <Text style={{padding: 3, marginBottom: 3}}>
                      {response.answers}
                    </Text>
                    <Space size={12} />
                  </View>
                ))
              : null}
            <Space size={12} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
              }}>
              <InputText
                onValueChange={text => {
                  this.updateNewResponse(text);
                }}
                value={this.state.newResponse}
                style={{height: 50, flex: 0.3}}
                placeholder={'Répondre...'}
              />
              <Space width={9} />
              <TouchableOpacity
                onPress={() => this.responseToComment(comment.com_id)}
                style={{
                  height: 21,
                  width: 21,
                  padding: 21,
                  borderRadius: 60,
                  alignItems: 'center',
                  backgroundColor: Color.darkBlue,
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesomeIcon
                  size={21}
                  icon={faPaperPlane}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>

            <Space size={9} />
          </View>
        );
      }
    });
  }

  async responseToComment(com_id) {
    const result = await fetch(API_URL + '/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers: this.state.newResponse,
        res_id: this.state.ressource.res_id,
        id_owner: this.state.user.usr_id,
        is_response: 1,
        id_response_to_usr: com_id,
      }),
    }).then(res => {
      return res;
    });

    if (result.ok) {
      this.setState({published: true});
      setTimeout(() => {
        this.setState({published: false});
      }, 5000);
      setTimeout(() => {
        this.props.navigation.navigate('TimeLine');
      }, 7000);
    }
  }

  updateNewComment(value) {
    this.setState({newComment: value});
  }

  updateNewResponse(value) {
    this.setState({newResponse: value});
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
          <View style={styles.comContainer}>
            {this.state.ressource ? this.renderCurrentComments() : null}
          </View>
          <Space size={30} />
          <InputText
            isTextInput
            onValueChange={text => {
              this.updateNewComment(text);
            }}
            value={this.state.newComment}
            placeholder={'Ecrire un commentaire...'}
          />
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

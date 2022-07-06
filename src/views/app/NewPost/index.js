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
import {API_URL, appName} from '../../../config/utils';

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

class NewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      openDropdown: false,
      valueCategory: null,
      categories: [],
      answers: null,
      canPublish: false,
      picture: null,
    };
  }

  async componentWillMount() {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    this.setState({
      user: user,
    });

    let categories = await fetch(API_URL + '/api/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        return res;
      });
    categories.forEach((category, index) => {
      categories[index].label = category.title;
      categories[index].value = category.cat_id;
    });
    this.setState({categories: categories});
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
        <Text style={styles.pseudo}>Nouvelle publication</Text>
      </View>
    );
  }

  async logout() {
    await AsyncStorage.removeItem('jwt');
    await AsyncStorage.removeItem('user');
    this.props.navigation.push('SignUpPage', {indexPage: 0});
  }

  setOpenDropdown(open) {
    this.setState({openDropdown: open});
  }

  setValue(callback) {
    this.setState(state => ({valueCategory: callback(state.valueCategory)}));
  }

  setItems(callback) {
    this.setState(state => ({categories: callback(state.categories)}));
  }

  updateAnswers(value) {
    this.setState({answers: value});
  }

  async takePic() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permission',
          message:
            'Nous avons besoin de la permission pour votre appareil photo.',
          buttonNegative: 'Annuler',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result = await launchCamera({
          saveToPhotos: true,
        });
        this.setState({picture: result});
      } else {
        this.setState({errorMsg: 'Permission refusée.'});
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async uploadFromLib() {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      noData: true,
    });
    this.setState({picture: result});
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
          <DropDownPicker
            zIndex={999}
            open={state.openDropdown}
            value={state.valueCategory}
            items={state.categories}
            placeholderStyle={{
              color: 'grey',
              fontWeight: 'bold',
            }}
            containerStyle={{maxWidth: '90%'}}
            placeholder={'Séléctionner une catégorie'}
            setOpen={this.setOpenDropdown.bind(this)}
            setValue={this.setValue.bind(this)}
            setItems={this.setItems.bind(this)}
          />
          <Space size={30} />
          <InputText
            isTextInput
            onValueChange={text => {
              this.updateAnswers(text);
            }}
            value={this.state.answers}
            placeholder={'Ecrire une légende...'}
          />
          <Space size={30} />
          <Text style={styles.title}>Ajouter un média</Text>
          <Space size={12} />
          {state.picture !== null ? (
            <>
              <Image
                source={{uri: state.picture.assets[0].uri}}
                style={{width: '90%', height: 300, borderRadius: 12}}
              />
              <Space size={45} />
            </>
          ) : (
            <InputText
              isTextInput
              disabled
              onValueChange={text => {
                this.updateAnswers(text);
              }}
              value={this.state.answers}
              placeholder={'Visualisez votre média ici.'}
            />
          )}
          <Space size={30} />
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <ButtonLarge
              onPress={this.takePic.bind(this)}
              style={styles.pickerBtn}
              title={'Prendre une photo'}
            />
            <Space width={45} />
            <ButtonLarge
              onPress={this.uploadFromLib.bind(this)}
              style={styles.pickerBtn}
              title={'Charger un média'}
            />
          </View>
          <Space size={45} />
          <ButtonLarge title="Publier" onPress={() => null} />
          <Space size={30} />
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

export default NewPost;

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
          <Space size={45} />
          <Space size={45} />
          <Space size={300} />
          <ButtonLarge title="Publier" onPress={() => null} />
          <Space size={30} />
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

export default NewPost;

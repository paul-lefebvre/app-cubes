/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {Text, View, TouchableOpacity, PermissionsAndroid} from 'react-native';
import styles from './style';

//PACKAGES
import Contacts from 'react-native-contacts';

//LAYOUTS
import * as Color from '../../../components/config/color';
import Container from '../../../components/layout/Container';
import Space from '../../../components/layout/Space';
import BigTitle from '../../../components/texts/BigTitle';

//CONSTANTS

class Surround extends React.Component {
  constructor(props) {
    super(props);
    this.swiper = React.createRef();
    this.state = {
      contacts: [],
    };
  }

  async componentDidMount() {
    try {
      const andoidContactPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Permission de Contacts',
          message: 'This app would like to view your contacts.',
          buttonNeutral: 'Ultérieurement',
          buttonPositive: 'OK',
        },
      );
      if (andoidContactPermission === PermissionsAndroid.RESULTS.GRANTED) {
        await Contacts.getAll().then(response => {
          this.setState({contacts: response});
        });
      } else {
        this.props.navigation.popToTop();
      }
    } catch (err) {
      console.log(err);
      this.props.navigation.popToTop();
    }
  }

  render() {
    const state = this.state;
    const propsNav = this.props.navigation.state.params;
    return (
      <Container
        backgroundColor={Color.colorBackground}
        justifyContent={'flex-start'}
        scrollEnabled={true}
        alignItems={'center'}>
        <Space size={60} />
        <BigTitle text={'Vos Contacts'} />
        <Space size={30} />
        {this.state.contacts
          ? this.state.contacts.map(contact => (
              <>
                <View style={styles.contactContainer}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={styles.textContact}>
                    {contact.displayName}
                  </Text>
                  <TouchableOpacity style={styles.contactBtn}>
                    <Text style={styles.contactBtnText}>Ajouter</Text>
                  </TouchableOpacity>
                </View>
                <Space size={9} />
              </>
            ))
          : null}
        <Space size={9} />
      </Container>
    );
  }
}

export default Surround;

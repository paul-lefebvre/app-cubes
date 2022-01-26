import * as React from 'react';

import Swiper from 'react-native-swiper';
import {connect} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {API_URL, versionApp} from '../../config/utils';

import Login from './Login';
import Register from './Register';

class IndexStart extends React.Component {
  constructor(props) {
    super(props);
    this.swiper = React.createRef();
    this.state = {
      indexPage: 1,
      info: null,
    };
  }

  // TASK BEFORE SPLASHSCREEN HIDE
  async componentDidMount() {
    const JWT_TOKEN = await AsyncStorage.getItem('id_token');
    let user = JSON.parse(await AsyncStorage.getItem('user_profile'));
    if (JWT_TOKEN && user) {
      if (user.versionApp !== versionApp) {
        user.versionApp = versionApp;
        try {
          await fetch(API_URL + '/api/clients/' + user.id, {
            method: 'PATCH',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/merge-patch+json',
              Authorization: 'Bearer ' + JWT_TOKEN,
            },
            body: JSON.stringify(user),
          }).then(async function (response) {
            await AsyncStorage.setItem('user_profile', JSON.stringify(user));
            return;
          });
        } catch (err) {
          console.error(err);
        }
      }
      this.props.navigation.navigate('Home');
    }
    SplashScreen.hide();
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.indexSwiper !== undefined) {
      if (props.indexSwiper === 1) {
        this.swiper.current.scrollTo(1, true);
      } else if (props.indexSwiper === 0) {
        this.swiper.current.scrollTo(0, true);
      }
    }
  }

  refreshIndex(index) {
    if (index === 1) {
      const swipeAction = {type: 'SWIPE_TITLE', value: 0};
      this.props.dispatch(swipeAction);
    } else if (index === 0) {
      const swipeAction = {type: 'SWIPE_TITLE', value: 1};
      this.props.dispatch(swipeAction);
    }
  }

  render() {
    return (
      <>
        <Swiper
          ref={this.swiper}
          onIndexChanged={index => {
            this.refreshIndex(index);
          }}
          loop={false}
          showsPagination={false}>
          <Login navigation={this.props.navigation} />
          <Register navigation={this.props.navigation} />
        </Swiper>
      </>
    );
  }
}

const mapStateToProps = state => {
  return state.togglePage;
};

export default connect(mapStateToProps)(IndexStart);

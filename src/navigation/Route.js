/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

// NAV & ASYNC
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';

// VIEWS
import Welcome from '../views/boarding/Welcome';
import Discover from '../views/boarding/Discover';
import SignUp from '../views/boarding/SignUp';

import TimeLine from '../views/app/TimeLine';
import Home from '../views/app/Home';
import Profil from '../views/app/Profil';

// RES
import TitleApp from '../components/titles/TItleApp';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome, faStream, faUser} from '@fortawesome/free-solid-svg-icons';

import * as Color from '../components/config/color';

/**
 * DEFAULT OPTIONS NAV APP
 */
const defaultNav = {
  headerStyle: {
    height: '27%',
    backgroundColor: Color.secondColorBackground,
  },
  headerTitle: () => null,
  headerTitleAlign: 'center',
  gestureDirection: 'horizontal',
  ...TransitionPresets.SlideFromRightIOS,
  animation: 'fade',
  headerShown: true,
  gestureEnabled: false,
};

/* WITHOUT HEADER */
const noHeaderNav = {
  headerTitle: () => null,
  headerTitleAlign: 'center',
  gestureDirection: 'horizontal',
  ...TransitionPresets.SlideFromRightIOS,
  animation: 'fade',
  headerShown: false,
  gestureEnabled: false,
};

/*
 *
 *  BOARDING FLOW
 *
 */
const BoardingStackNavigator = createStackNavigator({
  WelcomePage: {
    screen: Welcome,
    navigationOptions: noHeaderNav,
  },
  DiscoverPage: {
    screen: Discover,
    navigationOptions: {
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',
      headerShown: false,
      gestureEnabled: false,
    },
  },
  SignUpPage: {
    screen: SignUp,
    navigationOptions: noHeaderNav,
  },
  /*
  ForgotPassword: {
    screen: Welcome,
    navigationOptions: {
      headerTitle: () => (
        <TitleApp isNavigationEnabled={false} onlyTitleApp={true} />
      ),
      headerTitleAlign: 'center',
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',
      headerStyle: {
        minHeight: 75,
        height: 90,
      },
      headerShown: true,
      gestureEnabled: true,
      headerBackTitle: 'Retour',
    },
  },
  ForgotCodeReset: {
    screen: Welcome,
    navigationOptions: {
      headerTitle: () => (
        <TitleApp isNavigationEnabled={false} onlyTitleApp={true} />
      ),
      headerTitleAlign: 'center',
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',    navigationOptions: {
      headerStyle: {
        height: '27%',
        backgroundColor: Color.secondColorBackground,
      },
      headerTitle: () => null,
      headerTitleAlign: 'center',
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',
      headerShown: true,
      gestureEnabled: false,
    },
        height: 90,
      },
      headerShown: true,
      gestureEnabled: true,
      headerBackTitle: 'Retour',
    },
  },
  ForgotNewPassword: {
    screen: Welcome,
    navigationOptions: {
      headerTitle: () => (
        <TitleApp isNavigationEnabled={false} onlyTitleApp={true} />
      ),
      headerTitleAlign: 'center',
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',
      headerStyle: {
        minHeight: 75,
        height: 90,
      },
      headerShown: true,
      gestureEnabled: true,
      headerBackTitle: 'Retour',
    },
  },*/
});

/*
 *
 *  HOME APP FLOW
 *
 */
const TimeLineStackNavigator = createStackNavigator({
  TimeLine: {
    screen: TimeLine,
    navigationOptions: defaultNav,
  },
  /*
  Bluetooth: {
    screen: Welcome,
    navigationOptions: {
      headerTitle: () => (
        <TitleApp isNavigationEnabled={false} onlyTitleApp={true} />
      ),
      headerStyle: {
        minHeight: 75,
        height: 90,
      },
      headerTitleAlign: 'center',
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',
      headerShown: true,
      gestureEnabled: true,
      headerBackTitle: 'Retour',
    },
  },*/
});

/*
 *
 *  USER PROFIL FLOW
 *
 */
const ProfilStackNavigator = createStackNavigator({
  Profil: {
    screen: Welcome,
    navigationOptions: defaultNav,
  },
  History: {
    screen: Welcome,
    navigationOptions: {
      headerTitle: () => (
        <TitleApp isNavigationEnabled={false} onlyTitleApp={true} />
      ),
      headerTitleAlign: 'center',
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',
      headerShown: true,
      headerBackTitle: 'Retour',
      headerStyle: {
        minHeight: 75,
        height: 90,
      },
      gestureEnabled: true,
    },
  },
  Bill: {
    screen: Welcome,
    navigationOptions: {
      headerTitle: () => (
        <TitleApp isNavigationEnabled={false} onlyTitleApp={true} />
      ),
      headerTitleAlign: 'center',
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',
      headerBackTitle: 'Retour',
      headerShown: true,
      headerStyle: {
        minHeight: 75,
        height: 90,
      },
      gestureEnabled: true,
    },
  },
});

/*
 *
 *  ACTIVITY FLOW
 *
 */
const ActivityStackNavigator = createStackNavigator({
  Activity: {
    screen: Welcome,
    navigationOptions: defaultNav,
  },
  DetailActivity: {
    screen: Welcome,
    navigationOptions: {
      headerTitle: () => null,
      headerTitleAlign: 'center',
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',
      headerShown: false,
      headerBackTitle: 'Retour',
      headerStyle: {
        minHeight: 75,
        height: 90,
      },
      gestureEnabled: true,
    },
  },
});

/*
 *
 *  STACKS BOTTOM NAVBAR
 *
 */

const TabNavigator = createBottomTabNavigator(
  {
    TimeLine: {
      screen: createStackNavigator(
        {TimeLineStackNavigator},
        {
          defaultNavigationOptions: noHeaderNav,
        },
      ),
    },
    Activity: {
      screen: createStackNavigator(
        {ActivityStackNavigator},
        {
          defaultNavigationOptions: noHeaderNav,
        },
      ),
    },
    Profil: {
      screen: createStackNavigator(
        {ProfilStackNavigator},
        {
          defaultNavigationOptions: noHeaderNav,
        },
      ),
    },
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused}) => {
        const {routeName} = navigation.state;
        let color;
        let iconName;
        if (routeName === 'TimeLine') {
          iconName = focused ? faStream : faStream;
          color = focused ? 'black' : 'grey';
        } else if (routeName === 'Profil') {
          iconName = focused ? faUser : faUser;
          color = focused ? 'black' : 'grey';
        } else if (routeName === 'Activity') {
          iconName = focused ? faHome : faHome;
          color = focused ? 'black' : 'grey';
        }
        return (
          <FontAwesomeIcon
            icon={iconName}
            color={color}
            size={27}
            style={{resizeMode: 'contain'}}
          />
        );
      },
      tabBarOptions: {
        showLabel: false,
        showIcon: true,
      },
    }),
    initialRouteName: 'TimeLine',
  },
);

const App = createSwitchNavigator({
  Boarding: BoardingStackNavigator,
  Home: TabNavigator,
});

export default createAppContainer(App);

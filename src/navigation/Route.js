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
import Surround from '../views/app/Surround';

// RES
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome, faStream, faUser} from '@fortawesome/free-solid-svg-icons';
import {NeomorphFlex} from 'react-native-neomorph-shadows';
import * as Color from '../components/config/color';

/**
 * DEFAULT OPTIONS NAV APP
 */
const defaultNav = {
  headerStyle: {
    height: 40,
    borderWidth: 0,
    backgroundColor: Color.secondColorBackground,
  },
  headerTitle: () => null,
  headerLeft: () => null,
  headerTitleAlign: 'center',
  gestureDirection: 'horizontal',
  ...TransitionPresets.SlideFromRightIOS,
  animation: 'push',
  headerShown: true,
  gestureEnabled: false,
};

/* WITHOUT HEADER */
const noHeaderNav = {
  headerTitle: () => null,
  headerLeft: () => null,
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
    navigationOptions: defaultNav,
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
  Surround: {
    screen: Surround,
    navigationOptions: defaultNav,
  },
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
          <NeomorphFlex
            inner
            lightShadowColor="#D1CDC7"
            darkShadowColor="#D1CDE3"
            style={{
              height: 40,
              width: 40,
              backgroundColor: 'white',
              shadowOpacity: 0.8,
              shadowRadius: 2,
              shadowOffset: {
                width: 1,
                height: 1,
              },
              borderRadius: 60,
              margin: 12,
              marginBottom: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesomeIcon
              icon={iconName}
              color={color}
              size={18}
              style={{resizeMode: 'contain'}}
            />
          </NeomorphFlex>
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

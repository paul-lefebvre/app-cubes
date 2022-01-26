/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

// NAV & ASYNC
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';

// VIEWS
import Welcome from '../views/boarding/Welcome';

// RES
import TitleApp from '../components/titles/TItleApp';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faEnvelope,
  faEnvelopeOpen,
  faQrcode,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons';

/*
 *
 *  BOARDING FLOW
 *
 */
const BoardingStackNavigator = createStackNavigator({
  WelcomePage: {
    screen: Welcome,
    navigationOptions: {
      headerTitle: () => (
        <TitleApp isNavigationEnabled={false} onlyTitleApp={true} />
      ),
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',
      headerShown: false,
      headerStyle: {
        height: 180,
      },
      headerLeft: () => null,
      headerTitleAlign: 'center',
      headerTintColor: 'white',
      gestureEnabled: true,
    },
  },
  SuccessSignUp: {
    screen: Welcome,
    navigationOptions: {
      headerTitle: () => (
        <TitleApp isNavigationEnabled={false} onlyTitleApp={true} />
      ),
      headerTitleAlign: 'center',
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',
      headerLeft: () => null,
      headerStyle: {
        minHeight: 75,
        height: 90,
      },
      headerShown: true,
      gestureEnabled: false,
    },
  },
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
  },
});

/*
 *
 *  HOME FLOW
 *
 */
const HomeStackNavigator = createStackNavigator({
  Home: {
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
      gestureEnabled: false,
    },
  },
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
  },
  Scanner: {
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
      headerBackTitle: 'Retour',
      gestureEnabled: true,
    },
  },
  SessionStart: {
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
      headerBackTitle: 'Retour',
      gestureEnabled: true,
    },
  },
  SessionProgress: {
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
      gestureEnabled: false,
      headerLeft: () => {
        null;
      },
    },
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
    navigationOptions: {
      headerTitle: () => (
        <TitleApp isNavigationEnabled={false} onlyTitleApp={true} />
      ),
      headerTitleAlign: 'center',
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',
      headerShown: true,
      headerStyle: {
        minHeight: 75,
        height: 90,
      },
      gestureEnabled: true,
    },
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
 *  REPORT FLOW
 *
 */
const ReportStackNavigator = createStackNavigator({
  Report: {
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
      headerStyle: {
        minHeight: 75,
        height: 90,
      },
      gestureEnabled: true,
    },
  },
  CreateReport: {
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
  DetailReport: {
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
});

/*
 *
 *  STACKS BOTTOM NAVBAR
 *
 */

const TabNavigator = createBottomTabNavigator(
  {
    Profil: {
      screen: createStackNavigator(
        {ProfilStackNavigator},
        {
          defaultNavigationOptions: {
            headerTitleAlign: 'center',
            gestureDirection: 'horizontal',
            ...TransitionPresets.SlideFromRightIOS,
            animation: 'fade',
            headerShown: false,
            headerStyle: {
              minHeight: 75,
              height: 90,
            },
            gestureEnabled: true,
          },
        },
      ),
    },
    Home: {
      screen: createStackNavigator(
        {HomeStackNavigator},
        {
          defaultNavigationOptions: {
            headerTitleAlign: 'center',
            gestureDirection: 'horizontal',
            ...TransitionPresets.SlideFromRightIOS,
            animation: 'fade',
            headerStyle: {
              minHeight: 75,
              height: 90,
            },
            headerShown: false,
            gestureEnabled: true,
          },
        },
      ),
    },
    Report: {
      screen: createStackNavigator(
        {ReportStackNavigator},
        {
          defaultNavigationOptions: {
            headerTitleAlign: 'center',
            gestureDirection: 'horizontal',
            ...TransitionPresets.SlideFromRightIOS,
            animation: 'fade',
            headerStyle: {
              minHeight: 75,
              height: 90,
            },
            headerShown: false,
            gestureEnabled: true,
          },
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
        if (routeName === 'Home') {
          iconName = focused ? faQrcode : faQrcode;
          color = focused ? 'black' : 'grey';
        } else if (routeName === 'Profil') {
          iconName = focused ? faUser : faUser;
          color = focused ? 'black' : 'grey';
        } else if (routeName === 'Report') {
          iconName = focused ? faEnvelopeOpen : faEnvelope;
          color = focused ? 'black' : 'grey';
        } else if (routeName === 'Help') {
          iconName = focused ? faQuestionCircle : faQuestionCircle;
          color = focused ? 'black' : 'grey';
        }
        return (
          <FontAwesomeIcon
            icon={iconName}
            color={color}
            size={30}
            style={{resizeMode: 'contain'}}
          />
        );
      },
      tabBarOptions: {
        showLabel: false,
        showIcon: true,
      },
    }),
    initialRouteName: 'Home',
  },
);

/*
 *
 *  STACKS HOME
 *
 */

const FullStack = createStackNavigator({
  Tabs: {
    screen: TabNavigator,
    navigationOptions: {
      gestureDirection: 'horizontal',
      ...TransitionPresets.SlideFromRightIOS,
      animation: 'fade',
      headerShown: false,
      gestureEnabled: true,
    },
  },
});

const App = createSwitchNavigator({
  Boarding: BoardingStackNavigator,
  //Login: LoginStackNavigator,
  //Home: HomeStackNavigator,
});

export default createAppContainer(App);

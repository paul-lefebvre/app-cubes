/* eslint-disable no-unused-vars */
import 'react-native-gesture-handler';
import * as React from 'react';
import {StatusBar, LogBox, Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

//DEBUG
import {DEBUG} from './src/config/utils';

//NAVIGATION
import Route from './src/navigation/Route';

//REDUX
import {Provider} from 'react-redux';
import Store from './src/Store/configureStore';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    StatusBar.setBarStyle('dark-content', false);

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent', false);
      StatusBar.setTranslucent(true);
    }

    if (DEBUG) {
      LogBox.ignoreLogs([
        'Warning:',
        'Remote debugger',
        'Using Math.random',
        'scrollTo(y, x, animated)',
      ]);
    } else {
      console.log = () => {};
    }

    return (
      <Provider store={Store}>
        <Route />
      </Provider>
    );
  }
}

export default App;

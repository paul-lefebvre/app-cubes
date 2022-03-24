import {StyleSheet} from 'react-native';
import * as Color from '../../../components/config/color';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 60,
    width: '100%',
    backgroundColor: Color.blue,
  },
  pseudo: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 15,
    fontFamily: 'Montserrat-ExtraBold',
  },
  button: {
    flex: 0.15,
    marginRight: 21,
  },
  whiteLine: {
    height: 1,
    zIndex: 1,
    backgroundColor: 'white',
    width: '45%',
    alignSelf: 'center',
  },
});

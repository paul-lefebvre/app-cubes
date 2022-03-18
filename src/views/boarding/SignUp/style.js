import {StyleSheet} from 'react-native';
import * as Color from '../../../components/config/color';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  indexBtnContainer: {
    flex: 0.06,
    zIndex: 1,
    width: '90%',
    paddingHorizontal: '10%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  indexBtn: {
    flex: 1,
    width: '100%',
  },
  indexText: {
    flex: 1,
    fontSize: 15,
    letterSpacing: -0.3,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    color: 'white',
  },
  backgroundPage: {
    position: 'absolute',
    top: 0,
    height: '33%',
    width: '100%',
    borderBottomLeftRadius: 90,
    backgroundColor: Color.darkMagenta,
  },
  cardContainer: {
    width: '90%',
    height: 300,
    borderRadius: 33,
    shadowRadius: 4,
    shadowOpacity: 0.5,
    backgroundColor: '#EFEEEE',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  headerContainer: {
    flex: 0.21,
    zIndex: 1,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  appName: {
    flex: 1,
    color: 'white',
    fontSize: 21,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  whiteLine: {
    height: 1,
    zIndex: 1,
    backgroundColor: 'white',
    width: '45%',
    alignSelf: 'center',
  },
});

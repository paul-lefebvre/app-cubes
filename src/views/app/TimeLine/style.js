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
  appName: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 15,
    fontFamily: 'Montserrat-Bold',
  },
  button: {
    flex: 0.15,
    marginRight: 21,
  },
  addFriendsContainer: {
    marginBottom: 15,
  },
  addFriendsContentContainer: {
    paddingBottom: 9,
  },
  firstConnContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 30,
    width: '95%',
    backgroundColor: Color.colorBackground,
    borderWidth: 2,
    borderColor: 'white',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  addPulseIcon: {
    height: 120,
    alignSelf: 'center',
    position: 'relative',
  },
  whiteLine: {
    height: 1,
    zIndex: 1,
    backgroundColor: 'white',
    width: '45%',
    alignSelf: 'center',
  },
});

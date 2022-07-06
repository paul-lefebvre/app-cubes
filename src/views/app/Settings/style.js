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
  profilContainer: {
    flex: 0.15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  statContainer: {
    flex: 0.4,
    alignItems: 'center',
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
  smallText: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
  },
  numbers: {
    fontSize: 21,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  cardContainer: {
    width: '90%',
    borderRadius: 33,
    shadowRadius: 4,
    shadowOpacity: 0.5,
    backgroundColor: '#EFEEEE',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  errorMsg: {
    color: 'red',
    width: '75%',
    textAlign: 'center',
  },
});

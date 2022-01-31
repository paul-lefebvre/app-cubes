import {StyleSheet} from 'react-native';
import * as Color from '../../../components/config/color';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    width: '95%',
      borderRadius: 3,
      paddingHorizontal: 18,
      backgroundColor: 'white',
shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 1,
},
shadowOpacity: 0.18,
shadowRadius: 1.00,
elevation: 1,
  },
  textContact: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  },
  contactBtn: {
      borderRadius: 15,
      paddingHorizontal: 12,
    backgroundColor: Color.secondColorBackground,
  },
  contactBtnText: {
    fontSize: 15,
    color: 'white',
    height: 21,
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 0.6,
    fontFamily: 'Montserrat-Bold',
  },
});

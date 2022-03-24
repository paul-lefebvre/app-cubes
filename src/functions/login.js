import AsyncStorage from '@react-native-community/async-storage';
import {API_URL} from '../config/utils';

export default async datas => {
  return await fetch(API_URL + '/api/users/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mail: datas.mail,
      password: datas.password,
    }),
  })
    .then(res => res.json())
    .then(async function (result) {
      if (!result.error) {
        await AsyncStorage.setItem('jwt', result.acces_token);
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
        return result.user;
      } else {
        return result;
      }
    });
};

import AsyncStorage from '@react-native-community/async-storage';
import {API_URL} from '../config/utils';

export default async id => {
  return await fetch(API_URL + '/api/users/' + id, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(async function (result) {
      if (!result.error) {
        await AsyncStorage.setItem('user', JSON.stringify(result));
        return result;
      } else {
        return result;
      }
    });
};

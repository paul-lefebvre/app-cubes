import AsyncStorage from '@react-native-community/async-storage';
import {API_URL} from '../config/utils';

export default async datas => {
  return await fetch(API_URL + '/api/users', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(async function (result) {
      console.log(result);
      return result;
    });
};

import {API_URL} from '../config/utils';

export default async datas => {
  let encryptedPassword = datas.password;
  return await fetch(API_URL + '/api/users/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pseudo: datas.pseudo,
      firstname: datas.firstname,
      lastname: datas.lastname,
      mail: datas.mail,
      password: encryptedPassword,
    }),
  }).then(res => {
    return res;
  });
};

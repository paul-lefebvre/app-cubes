import AsyncStorage from '@react-native-community/async-storage';

// CONSTANTS
const appName = 'Links For Citizens';
const versionApp = '0.0.1';

let DEBUG_API_URL = 'http://192.168.69.196:3000';
let API_URL = 'http://localhost:3000';

const DEBUG = true;
const NEED_PROD = false;

if (DEBUG && NEED_PROD) {
  API_URL = ''; //PROD
  console.log('> DEBUG MODE ENABLED');
} else if (!DEBUG && NEED_PROD) {
  API_URL = ''; //PROD
} else if (!DEBUG && !NEED_PROD) {
  API_URL = DEBUG_API_URL ? DEBUG_API_URL : 'http://localhost:3000'; //LOCAL
} else if (DEBUG && !NEED_PROD) {
  API_URL = DEBUG_API_URL ? DEBUG_API_URL : 'http://localhost:3000'; //LOCAL
  console.log('> DEBUG MODE ENABLED | API URL -> ', API_URL);
}

/**********************************
 *        REFRESH USER TOKEN
 **********************************/
async function refreshToken() {
  const REF_TOKEN = await AsyncStorage.getItem('refresh_token');
  await AsyncStorage.removeItem('id_token');
  await AsyncStorage.removeItem('refresh_token');

  console.log('REFRESH TOKEN');

  await fetch(API_URL + '/token/refresh', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: REF_TOKEN,
    }),
  })
    .then(res => res.json())
    .then(async function (result) {
      await AsyncStorage.setItem('id_token', result.token);
      await AsyncStorage.setItem('refresh_token', result.refresh_token);
      return;
    });
}

/*******************
 *  PAGINATE DATAS
 ******************/
function paginate(arr, size) {
  return arr.reduce((acc, val, i) => {
    let idx = Math.floor(i / size);
    let page = acc[idx] || (acc[idx] = []);
    page.push(val);

    return acc;
  }, []);
}

export {appName, versionApp, API_URL, DEBUG, refreshToken, paginate};

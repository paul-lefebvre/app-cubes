//PRIMARY FCT MODBUS
import {
  readSession,
  readLastTenSessions,
  getTheBorneID,
  writeMultiplesRegisters,
  getTheLastSessionID,
  checkIfBorneAlreadyCharging,
} from './session';

//CONST
import {calcRegForSession, sleep} from './constants';

/*=================================================================
  *
  *              DEMARRAGE D'UNE SESSION DE CHARGE
  *
  =================================================================*/

async function StartChargeSession(idUser, now, device, worker) {
  let key = [now + idUser];

  for (let loop = 3; loop > 0; loop--) {
    await writeMultiplesRegisters(102, 4, [0, idUser, now], 8, device, worker);

    sleep(90);

    await writeMultiplesRegisters(136, 2, key, 4, device, worker);

    sleep(90);

    console.log('\x1b[32m' + '[SOCKET] requête envoyée avec succès');
    return true;
  }
}

/*=================================================================
  *
  *               LECTURE D'UNE SEULE SESSION
  *
  =================================================================*/

async function readOneSession(SessionId) {
  try {
    await BTSerial.isConnected().then(res => {
      if (res) {
        console.log('[SOCKET] device connecté');
      } else {
        console.log("[SOCKET] impossible d'effectuer la connexion");
        return false;
      }
    });
  } catch (err) {
    console.log('[SOCKET] Erreur : ', err.message);
    return false;
  }

  let StartRegistre = calcRegForSession(SessionId);

  try {
    await readSession(StartRegistre).then(res => {
      if (!res) {
        console.log('[MODBUS] Erreur de la session');
        return false;
      }
    });
  } catch (err) {
    console.log('[MODBUS] Erreur : ', err.message);
    return false;
  }

  return true;
}

/*=================================================================
  *
  *           LECTURE REG 110 111 BORNE DEJA EN UTILISATION ?
  *
  =================================================================*/

async function checkBorneAlreadyCharging(device, worker) {
  return await checkIfBorneAlreadyCharging(device, worker);
}

/*=================================================================
  *
  *           LECTURE DE L'ID DE LA BORNE
  *
  =================================================================*/

async function getBorneID(device, worker) {
  return await getTheBorneID(device, worker);
}

/*=================================================================
  *
  *           LECTURE DE LAST SESSION ID
  *
  =================================================================*/

async function getLastSessionID(device, worker) {
  return await getTheLastSessionID(device, worker);
}

/*=================================================================
  *
  *           LECTURE DES 10 DERNIERES SESSIONS
  *
  =================================================================*/

async function readTenSessions(device, worker, lastSessionID, manager) {
  let StartRegistre = calcRegForSession(lastSessionID);
  let numberOfSessionsToRead = 3;

  return await readLastTenSessions(
    StartRegistre,
    numberOfSessionsToRead,
    device,
    worker,
    manager,
  );
}

export {
  StartChargeSession,
  readTenSessions,
  readOneSession,
  getBorneID,
  getLastSessionID,
  checkBorneAlreadyCharging,
};

/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */
/* eslint-disable no-unused-vars */
import base64 from 'react-native-base64';
import {calcCRC} from './crc16';

import {
  SLAVEID,
  encode,
  READSINGLE,
  NBSESSIONREG,
  sleep,
  WRITEMULTIPLE,
  LASTSESSIONIDREG,
  BORNEIDREG,
  NBDATAFORDEFAULTMTU,
} from './constants';

import {Platform} from 'react-native';

/*=================================================================
*
*              FUNCTION : HANDLE MODBUS ERRORS RESPONSE (QUERY MODBUS + BRUT RESPONSE SERVICE)
*
================================================================= */

async function handleErrorMdb(query, response, worker, device) {
  let responseToVerify = null;

  if (Platform.OS === 'ios') {
    responseToVerify = await device
      .readCharacteristicForService(worker.serviceUUID, worker.uuid)
      .then(async (result, error) => {
        if (error) {
          console.log('ERROR READ :', error);
          return false;
        }
        console.log(result.value);
        return result.value;
      });
  } else {
    responseToVerify = response.value;
  }

  let resp = base64.decode(responseToVerify);
  let str = '';
  for (let n = 0; n < resp.length; n += 1) {
    if (resp.charCodeAt(n).toString(encode) == 0) {
      str += '00';
    } else if (resp.charCodeAt(n).toString(encode).length === 1) {
      str += '0' + resp.charCodeAt(n).toString(encode).toUpperCase();
    } else {
      str += resp.charCodeAt(n).toString(encode).toUpperCase();
    }
  }
  resp = str;

  if (query === resp) {
    console.log('\x1b[1m\x1b[34m[RESPONSE] MODBUS OK');
    return true;
  } else {
    console.log('\x1b[31m[RESPONSE] ERROR MODBUS :', resp);
    return false;
  }
}

/* =================================================================
*
*              FUNCTION : WRITE MULTIPLES REGISTERS
*
================================================================= */

async function writeMultiplesRegisters(
  startRegistre,
  nRegisters,
  values,
  nbFollowBytes,
  device,
  worker,
) {
  // VERFIFICATIONS
  if (SLAVEID === null || WRITEMULTIPLE === null) {
    console.log('\x1b[31m[INIT] some constants are not defined');
    return false;
  }
  if (
    startRegistre === null ||
    nRegisters === null ||
    nbFollowBytes === null ||
    values === null
  ) {
    console.log('\x1b[31m[INIT] some params are not defined');
    return false;
  }

  // VAR
  let i = 0;
  let query = '';
  let buffer = [];

  // BUFFER STRUCT ALSO FOR LONG VALUES
  buffer[i++] = SLAVEID;
  buffer[i++] = WRITEMULTIPLE;
  buffer[i++] = (startRegistre >> 8) & 0xff;
  buffer[i++] = startRegistre % 256 & 0xff;
  buffer[i++] = (nRegisters >> 8) & 0xff;
  buffer[i++] = nRegisters % 256 & 0xff;
  buffer[i++] = nbFollowBytes % 256 & 0xff;

  values.forEach(val => {
    if (val.toString().length <= 4) {
      buffer[i++] = (val >> 8) & 0xffff;
      buffer[i++] = val % 256 & 0xff;
    } else {
      buffer[i++] = (val >> 24) & 0xff;
      buffer[i++] = (val >> 16) & 0xff;
      buffer[i++] = (val >> 8) & 0xff;
      buffer[i++] = val & 0xff;
    }
  });

  // BUILD CHECKSUM
  let checksum = calcCRC(buffer, 0);
  buffer[i++] = checksum[0];
  buffer[i++] = checksum[1];

  // ENCODE BUFFER & ADD 0 TO ALONE OCTET
  buffer.forEach(function (el, index) {
    if (el.toString(encode).length === 1) {
      buffer[index] = '0' + el.toString(encode);
    } else {
      buffer[index] = el.toString(encode);
    }
  });

  // ADD SEPARATOR FOR EACH OCTET (ACTUALLY NOT NEEDED else add a char after second expression)
  for (let j = 0; j < buffer.length; j++) {
    if (j + 1 == buffer.length) {
      query += buffer[j];
    } else {
      query += buffer[j];
    }
  }

  // FORMAT QUERY TO STRING > HEX > ASCII > BASE64
  query = query.toString('utf-8');
  query = query.toUpperCase();
  //console.log('FINAL QUERY :', query);

  let hex = query.toString();
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }

  console.log(query);

  let queryEncoded = base64.encode(str);

  /* WRITE QUERY */
  let res = await device
    .writeCharacteristicWithoutResponseForService(
      worker.serviceUUID,
      worker.uuid,
      queryEncoded,
    )
    .then(result => {
      let checkMdbResp = handleErrorMdb(query, result);
      if (checkMdbResp) {
        console.log('SUCCESS WRITE', values);
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      console.log(error);
      return false;
    });
  /* END WRITE */
  return res;
}

/*=================================================================
  *
  *              FUNCTION : READ 1 REGISTER
  *
  ================================================================= */

async function readRegister(registre, device, worker) {
  // VERFIFICATIONS
  if (SLAVEID === null || READSINGLE === null) {
    console.log('\x1b[31m[INIT] some constants are not defined');
    return false;
  }
  if (registre === null || device === null || worker === null) {
    console.log('\x1b[31m[INIT] some params are not defined');
    return false;
  }

  // VAR
  let i = 0;
  let query = '';
  let buffer = [];

  // BUFFER STRUCT
  buffer[i++] = SLAVEID;
  buffer[i++] = READSINGLE;
  buffer[i++] = (registre >> 8) & 0xffff;
  buffer[i++] = registre % 256 & 0xff;
  buffer[i++] = (1 >> 8) & 0xffff;
  buffer[i++] = 1 % 256 & 0xff;

  // BUILD CHECKSUM
  let checksum = calcCRC(buffer, 0);
  buffer[i++] = checksum[0];
  buffer[i++] = checksum[1];

  // ENCODE BUFFER & ADD 0 TO ALONE OCTET
  buffer.forEach(function (el, index) {
    if (el.toString(encode).length === 1) {
      buffer[index] = '0' + el.toString(encode);
    } else {
      buffer[index] = el.toString(encode);
    }
  });

  // ADD SEPARATOR FOR EACH OCTET (ACTUALLY NOT NEEDED else add a char after second expression)
  for (let j = 0; j < buffer.length; j++) {
    if (j + 1 == buffer.length) {
      query += buffer[j];
    } else {
      query += buffer[j];
    }
  }

  // FORMAT QUERY TO STRING > HEX > ASCII > BASE64
  query = query.toString('utf-8');
  query = query.toUpperCase();
  //console.log('FINAL QUERY :', query);

  let hex = query.toString();
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  let queryEncoded = base64.encode(str);

  /* WRITE QUERY */
  let res = await device
    .writeCharacteristicWithoutResponseForService(
      worker.serviceUUID,
      worker.uuid,
      queryEncoded,
    )
    .then(async result => {
      let checkMdbResp = await handleErrorMdb(
        query,
        result,
        worker,
        device,
      ).then(res => {
        return res;
      });
      if (checkMdbResp) {
        console.log('SUCCESS READ', registre);
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      console.log(error);
      return false;
    });
  /* END WRITE */
  return res;
}

/*=================================================================
  *
  *              FUNCTION : READ 2 to 20 REGISTERS
  *
  ================================================================= */

async function readHoldingRegisters(
  registre,
  nbRegToRead,
  device,
  worker,
  limit,
) {
  // VERFIFICATIONS
  if (SLAVEID === null || READSINGLE === null) {
    console.log('\x1b[31m[INIT] some constants are not defined');
    return false;
  }
  if (
    registre === null ||
    nbRegToRead === null ||
    device === null ||
    worker === null
  ) {
    console.log('\x1b[31m[INIT] some params are not defined');
    return false;
  }
  if (nbRegToRead > limit) {
    console.log(
      "\x1b[31m[INIT] can't read more than " + limit + ' registers in a query.',
    );
    return false;
  }

  // VAR
  let i = 0;
  let query = '';
  let buffer = [];

  // BUFFER STRUCT
  buffer[i++] = SLAVEID;
  buffer[i++] = READSINGLE;
  buffer[i++] = (registre >> 8) & 0xffff;
  buffer[i++] = registre % 256 & 0xff;
  buffer[i++] = (nbRegToRead >> 8) & 0xffff;
  buffer[i++] = nbRegToRead % 256 & 0xff;

  // BUILD CHECKSUM
  let checksum = calcCRC(buffer, 0);
  buffer[i++] = checksum[0];
  buffer[i++] = checksum[1];

  // ENCODE BUFFER & ADD 0 TO ALONE OCTET
  buffer.forEach(function (el, index) {
    if (el.toString(encode).length === 1) {
      buffer[index] = '0' + el.toString(encode);
    } else {
      buffer[index] = el.toString(encode);
    }
  });

  // ADD SEPARATOR FOR EACH OCTET (ACTUALLY NOT NEEDED else add a char after second expression)
  for (let j = 0; j < buffer.length; j++) {
    if (j + 1 == buffer.length) {
      query += buffer[j];
    } else {
      query += buffer[j];
    }
  }

  // FORMAT QUERY TO STRING > HEX > ASCII > BASE64
  query = query.toString('utf-8');
  query = query.toUpperCase();
  //console.log('FINAL QUERY :', query);

  let hex = query.toString();
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  let queryEncoded = base64.encode(str);

  /* WRITE QUERY */
  let res = await device
    .writeCharacteristicWithoutResponseForService(
      worker.serviceUUID,
      worker.uuid,
      queryEncoded,
    )
    .then(async result => {
      let checkMdbResp = await handleErrorMdb(
        query,
        result,
        worker,
        device,
      ).then(res => {
        return res;
      });
      if (checkMdbResp) {
        console.log('SUCCESS READ MULTIPLES', registre);
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      console.log('\x1b[31m[ERROR MODBUS]', error);
      return false;
    });
  /* END WRITE */

  return res;
}

/*=================================================================
  *
  *              FUNCTION : READ ONLY ONE SESSION
  *
  ================================================================= */

async function readOnlyOneSession(register, device, worker) {
  if (register === null || device === null || worker === null) {
    throw '\x1b[31m[INIT] some params aren\t defined';
  }

  // VAR
  let hexResult = null;
  let read = null;
  let retry = 2;
  let queryOK = null;
  let versionOS = null;

  if (Platform.OS === 'android') {
    versionOS = await Platform.constants['Release'].substring(0, 2);
  } else {
    versionOS = Platform.constants.osVersion.substring(0, 2);
  }

  while (queryOK != true || retry !== 0) {
    queryOK = await readRegister(register, device, worker).then(res => {
      return res;
    });
    if (queryOK === false) {
      sleep(1000);
    }
    if (retry <= 0) {
      return false;
    }
    if (Platform.OS == 'ios' && versionOS <= 12) {
      sleep(210);
    } else if (Platform.OS == 'android' && versionOS <= 7) {
      sleep(200);
    } else if (Platform.constants.Manufacturer === 'HUAWEI') {
      sleep(245);
    } else {
      sleep(120);
    }
    retry--;
  }

  let limit = 3 + 2 + 1 * 2; // length of : HEADER + CRC + NBSESSION * 2 octets

  /* READ REQUEST */
  read = await device
    .readCharacteristicForService(worker.serviceUUID, worker.uuid)
    .then(async (result, error) => {
      if (error) {
        console.log('ERROR READ :', error);
        return false;
      }
      let res = base64.decode(result.value);
      var arr1 = [];
      for (var n = 0, l = res.length; n < l; n++) {
        var hex = Number(res.charCodeAt(n)).toString(16);
        arr1.push(hex);
      }
      hexResult = arr1;

      //console.log('hex', result);

      if (
        hexResult[0] === SLAVEID.toString(encode) &&
        hexResult.includes(SLAVEID.toString(encode)) &&
        hexResult.includes(READSINGLE.toString(encode))
      ) {
        // VAR
        let crcSend = hexResult.slice(hexResult.length - 2, hexResult.length);
        let valueToCrcCheck = hexResult.slice(0, limit - 2);

        /*  CHECK DU CRC A DEV
            let crc = calcCRC(valueToCrcCheck, 0);
            console.log(crc);
            if(crcSend[0] === crc[0] && crcSend[1] === crc[1]){}
            */

        /* RESULTAT */
        let result = hexResult.slice(3, hexResult.length - 2);
        let finalValue;

        finalValue = parseInt(result[0] + result[1], encode);

        console.log(
          '[' + register + '] RESULTAT : \x1b[4m',
          finalValue,
          '\x1b[0m',
        );

        return finalValue;
      }
    });

  /* END READ */
  return read;
}

/*=================================================================
  *
  *              FUNCTION : READ MULTIPLES SESSIONS
  *
  ================================================================= */

async function readSession(start, limit, nbRegToRead, device, worker, manager) {
  if (
    start === null ||
    limit === null ||
    nbRegToRead === null ||
    device === null ||
    worker === null ||
    manager === null
  ) {
    console.log("\x1b[31m[INIT] some params aren't defined");
    return false;
  }

  // VAR
  let hexResult = null;
  let read = null;
  let retry = 2;
  let queryOK = null;
  let versionOS = null;

  if (Platform.OS === 'android') {
    versionOS = await Platform.constants['Release'].substring(0, 2);
  } else {
    versionOS = Platform.constants.osVersion.substring(0, 2);
  }

  while (queryOK !== true || retry !== 0) {
    queryOK = await readHoldingRegisters(
      start,
      nbRegToRead,
      device,
      worker,
      limit,
    ).then(res => {
      return res;
    });
    if (Platform.OS == 'ios' && versionOS <= 12) {
      sleep(25);
    } else if (Platform.OS == 'android' && versionOS <= 7) {
      sleep(20);
    } else if (Platform.constants.Manufacturer === 'HUAWEI') {
      sleep(33);
    }
    sleep(40);
    if (queryOK === false) {
      sleep(1000);
    }
    if (retry <= 0) {
      return false;
    }

    retry--;
  }

  if (Platform.OS == 'ios' && versionOS <= 12) {
    sleep(12);
  } else if (Platform.OS == 'android' && versionOS <= 7) {
    sleep(10);
  } else if (Platform.constants.Manufacturer === 'HUAWEI') {
    sleep(33);
  }
  sleep(30);

  read = await manager
    .readCharacteristicForDevice(device.id, worker.serviceUUID, worker.uuid)
    .then((result, error) => {
      if (error) {
        console.log('ERROR READ :', error);
        return false;
      }

      let res = base64.decode(result.value);
      var arr1 = [];
      for (var n = 0, l = res.length; n < l; n++) {
        var hex = Number(res.charCodeAt(n)).toString(16);
        arr1.push(hex);
      }
      hexResult = arr1;

      console.log('RESULTAT DE LA RESPONSE :', hexResult);

      limit = limit * 2 + 5; // * 2 for 2 datas received

      if (hexResult.length === limit) {
        /*
            let crcSend = hexResult.slice(hexResult.length - 2, hexResult.length);
            let valueToCrcCheck = hexResult.slice(0, limit - 2);
                CHECK DU CRC A DEV
                let crc = calcCRC(valueToCrcCheck, 0);
                console.log(crc);
                if(crcSend[0] === crc[0] && crcSend[1] === crc[1]){}
            */

        // RESULTAT
        let finResult = hexResult.slice(3, limit - 2);
        let resStructured = [];

        finResult.forEach((res, index) => {
          if (res.length === 1) {
            finResult[index] = '0' + res.toString(encode);
          }
        });

        // RESTRUCT DES VALEURS
        for (let i = 0; i <= finResult.length; i += 4) {
          if (i !== 0) {
            let newValue = parseInt(
              finResult[i - 4] +
                finResult[i - 3] +
                finResult[i - 2] +
                finResult[i - 1],
              encode,
            );
            resStructured.push(newValue.toString());
          }
        }

        console.log(
          '[' +
            start +
            '] RESULTAT (' +
            resStructured.length +
            ') : ' +
            resStructured,
        );
        return resStructured;
      } else if (
        hexResult.length === 5 &&
        hexResult[0] === SLAVEID.toString(encode)
      ) {
        console.log(
          'MODBUS ERROR : \x1b[31m ' +
            hexResult +
            ' | Erreur Modbus... Vérifiez la query ',
        );
        return false;
      } else {
        console.log('UNEXPECTED ERROR : \x1b[31m ' + hexResult);
        return false;
      }
    });

  return read;
}

/*=================================================================
  *
  *              FUNCTION : BORNE ALREADY CHARGING ?
  *
  ================================================================= */

async function checkIfBorneAlreadyCharging(device, worker) {
  let firstResult = await readOnlyOneSession(110, device, worker).then(
    async function (result) {
      return result;
    },
  );

  if (firstResult === false) {
    return 'MDBERROR';
  }

  sleep(85);

  let secResult = await readOnlyOneSession(111, device, worker).then(
    async function (result) {
      return result;
    },
  );

  if (secResult === false) {
    return 'MDBERROR';
  }

  if (firstResult == 0 && secResult == 0) {
    return false;
  } else {
    return true;
  }
}

/*=================================================================
  *
  *              FUNCTION : GET BORNE ID
  *
  ================================================================= */

async function getTheBorneID(device, worker) {
  return await readOnlyOneSession(BORNEIDREG, device, worker);
}

/*=================================================================
  *
  *              FUNCTION : GET LAST SESSION ID
  *
  ================================================================= */

async function getTheLastSessionID(device, worker) {
  return await readOnlyOneSession(LASTSESSIONIDREG, device, worker);
}

/*=================================================================
  *
  *              FUNCTION : GET TEN LAST SESSIONS
  *
  ================================================================= */

async function readLastTenSessions(start, repeat, device, worker, manager) {
  if (
    repeat === null ||
    start === null ||
    device === null ||
    worker === null ||
    manager === null
  ) {
    console.log("\x1b[31m[INIT] some params aren't defined");
    return false;
  }

  let records = [],
    structuredRecords = [];
  let nbQueryForOneSession = NBSESSIONREG / NBDATAFORDEFAULTMTU;
  let limitQuery = Math.round(15 / 4);
  let nextValues = start;
  let versionOS = null;

  if (Platform.OS === 'android') {
    versionOS = await Platform.constants['Release'].substring(0, 2);
  } else {
    versionOS = Platform.constants.osVersion.substring(0, 2);
  }

  for (let i = 0; i < repeat; i++) {
    for (let y = 0; y < nbQueryForOneSession; y++) {
      records.push(
        await readSession(
          nextValues,
          limitQuery,
          NBDATAFORDEFAULTMTU,
          device,
          worker,
          manager,
        ),
      );
      nextValues += 4;
    }

    if (Platform.OS == 'ios' && versionOS <= 12) {
      sleep(12);
    } else if (Platform.OS == 'android' && versionOS <= 7) {
      sleep(10);
    } else if (Platform.constants.Manufacturer === 'HUAWEI') {
      sleep(30);
    }
    sleep(5);

    for (let y = 0; y < nbQueryForOneSession; y++) {
      records.push(
        await readSession(
          nextValues,
          limitQuery,
          NBDATAFORDEFAULTMTU,
          device,
          worker,
          manager,
        ),
      );
      nextValues += 4;
    }

    start += NBSESSIONREG;
    start -= 3 * NBSESSIONREG;
    nextValues = start;

    if (records[i] === false) {
      return false;
    }
  }

  for (let j = 0; j < records.length; j++) {
    if (j % 10 === 0) {
      records[j] = records[j]
        .concat(records[j + 1])
        .concat(records[j + 2])
        .concat(records[j + 3])
        .concat(records[j + 4])
        .concat(records[j + 5]);
      records[j] = records[j]
        .concat(records[j + 6])
        .concat(records[j + 7])
        .concat(records[j + 8])
        .concat(records[j + 9]);
      structuredRecords.push(records[j]);
    }
  }

  console.log('RESULTAT FINAL', structuredRecords);

  if (structuredRecords) {
    return structuredRecords;
  } else {
    return false;
  }
}

export {
  writeMultiplesRegisters,
  readHoldingRegisters,
  readLastTenSessions,
  readSession,
  getTheBorneID,
  getTheLastSessionID,
  checkIfBorneAlreadyCharging,
  handleErrorMdb,
};

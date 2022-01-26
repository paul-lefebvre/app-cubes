//CONSTANTS & FUNCTIONS
let encode = 16;

let SLAVEID = 25;

let READSINGLE = 3;
let READMULTIPLE = 5;
let WRITESINGLE = 6;
let WRITEMULTIPLE = 16;

let BORNEIDREG = 17;
let LASTSESSIONIDREG = 29;

//LECTURE DE SESSIONS
let SESSIONFIRSTREG = 400;
let NBSESSIONREG = 20;
let MAXNBSESSION = 10;
let NBDATAFORDEFAULTMTU = 4;

let MEMORYSESSIONLOG = 150;

function calcRegForSession(sessionId) {
  let reg =
    SESSIONFIRSTREG + 2 * NBSESSIONREG * ((sessionId - 1) % MEMORYSESSIONLOG);
  console.log('REGISTRE :', reg, 'FOR SESSION ID :', sessionId);
  return reg;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

export {
  SLAVEID,
  READSINGLE,
  READMULTIPLE,
  WRITESINGLE,
  WRITEMULTIPLE,
  encode,
  SESSIONFIRSTREG,
  NBSESSIONREG,
  MAXNBSESSION,
  NBDATAFORDEFAULTMTU,
  BORNEIDREG,
  LASTSESSIONIDREG,
  calcRegForSession,
  sleep,
};

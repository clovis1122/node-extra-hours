'use strict';

const zohoService = {};

// Dependencies

zohoService._https = require('../helper/https');
zohoService._dateHelper = require('../helper/date');
zohoService._querystring = require('querystring');
zohoService._config = require('../../config');


zohoService.createZohoEntry = async function (zohoAnswers) {
  // ZOHO REQUIRES US TO SEND THE SALARY. THIS IS A POTENTIAL PRIVACY BREACH.
  // TODO: finish the development once this issue is solved.

  throw new Error('ZOHO DEVELOPMENT IS NOT DONE.');

  const data = querystring.stringify({
    authtoken: zohoAnswers.authToken,
    inputData: JSON.stringify({
      'Fecha_de_solicitud1': zohoService._dateHelper.getCurrentDateWithZohoFormat(),
      'Creado_por': zohoAnswers.userId,
      'Colaborador': zohoAnswers.userId,
      'PM_que_autoriz_las_horas_extras': zohoAnswers.pmId,
      E2: 1000,
      D2: 1000,
      F2: 1000,
      N2: 1000,
      E: 1000,
      D: 1000,
      F: 1000,
      N: 10000,
      VD1: 100000,
      'Motivaci_n': 'un dia de esos',
      'Fecha_de_aplicaci_n': zohoService._dateHelper.getCurrentDateWithZohoFormat(),
    })
  });

  const url = zohoService._config['ZOHO_CREATE_RECORD_URL']+'?'+data;

  const rsp = await zohoService._https.makeRequestAsync(url)
  if (res.statusCode !== 200) throw new Error('Error connecting to Toggl API.');
};

module.exports = zohoService;

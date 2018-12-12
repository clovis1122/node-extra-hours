'use strict';

const extraHoursCli = {};

// Dependencies

extraHoursCli._readline = require('readline');
extraHoursCli._console = require('../console');
extraHoursCli._togglService = require('../toggl');
extraHoursCli._zohoService = require('../zoho');
extraHoursCli._config = require('../../config');

extraHoursCli._askAsync = function(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
};

extraHoursCli._printTotalHours = function(projects) {
  const total = {weekday: 0, weekend: 0, nightly: 0};

  projects.forEach(project => {
    total.weekday += project.weekday || 0;
    total.weekend += project.weekend || 0;
    total.nightly += project.nightly || 0;
  });

  extraHoursCli._console.print('Total weekday: '+total.weekday);
  extraHoursCli._console.print('Total weekend: '+total.weekend);
  extraHoursCli._console.print('Total nightly: '+total.nightly);

  extraHoursCli._console.newLine();
}

extraHoursCli._printExtraHoursSummary = function(projects) {
  for(const project of projects) {
    extraHoursCli._console.print('Project PID: '+project.name);
    extraHoursCli._console.print('Weekday: '+project.weekday.toFixed(2));
    extraHoursCli._console.print('Weekend: '+project.weekend.toFixed(2));
    extraHoursCli._console.print('Nocturn: '+project.nightly.toFixed(2));
    extraHoursCli._console.newLine();
  }
}

extraHoursCli._printProjectsSummary = function(projects) {
  for (const project of projects) {
    extraHoursCli._console.print('Project name: '+project.name);

    for (const date of project.dates) {
      extraHoursCli._console.print('-'+date.name);

      for(const entry of date.entries) {
        const dateLabel = `--${entry.start} - ${entry.stop}`;
        const nightLabel = entry.isNight ? 'NIGHT' : 'DAY';

        extraHoursCli._console.print(`--${dateLabel}: ${entry.description} ${nightLabel}`);
      }
    }

    extraHoursCli._console.newLine();
  }
}

extraHoursCli._printReportSummary = function(projects) {
  extraHoursCli._console.print('Summary: \n');

  extraHoursCli._printTotalHours(projects);
  extraHoursCli._printExtraHoursSummary(projects);
  extraHoursCli._printProjectsSummary(projects);
};

extraHoursCli._askTogglQuestions = async function() {
  const answers = {};
  const rl = extraHoursCli._readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout
  });

  answers.apiToken = await extraHoursCli._askAsync(rl, 'Enter your Toggl API Token: ');
  const daysAgo = await extraHoursCli._askAsync(rl, 'Enter the # of days to look back: ');
  answers.daysAgo = Number(daysAgo);

  rl.close();

  return answers;
};

extraHoursCli._askZohoQuestions = async function() {
  const answers = {};
  const rl = extraHoursCli._readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout
  });

  answers.authToken = await extraHoursCli._askAsync(rl, 'Enter your Zoho Auth Token: ');
  answers.userId = await extraHoursCli._askAsync(rl, 'Enter your Zoho User ID: ');
  answers.pmId = await extraHoursCli._askAsync(rl, 'Enter the PM User ID that\'s approving the extra hours: ');

  rl.close();

  return answers;
};

extraHoursCli.start = async function() {
  try {
  
    extraHoursCli._console.print('Welcome to the Extra Hours Extractor! Press ^C to quit.\n');

    const answers = await extraHoursCli._askTogglQuestions();

    extraHoursCli._console.print('Getting your data from the TOGGL API...\n');
  
    const projects = await extraHoursCli._togglService.getUserEntriesFromToggl(answers);
  
    extraHoursCli._printReportSummary(projects);

    // TODO: zoho development is down at the moment. Re-enable it once the privacy breach
    // is fixed.

    // extraHoursCli._console.print('Zoho Integration is unavailable at the moment.\n');
    extraHoursCli._console.print('Have a good day :)');

    if (!extraHoursCli._config['ZOHO_ENABLED']) {
      return false;
    }

    extraHoursCli._console.print(
      'We can submit this report directly to ZOHO. You may still edit the form once it was'
      +' submitted by accessing it from the ZOHO page.\n'
    );

    const submitToZoho = await extraHoursCli._askAsync(rl,
      'Type "SUBMIT" to submit to zoho. Press anything else to exit: '
    );

    if (submitToZoho === 'SUBMIT') {
      const zohoAnswers = extraHoursCli._askZohoQuestions();
      await extraHoursCli._zohoService.createZohoEntry(zohoAnswers);

    } else {
      extraHoursCli._console.print('Have a good day :)');
    }

  } catch(e) {
    extraHoursCli._console.error(e);
    return true;
  }

  return false;
}

module.exports = extraHoursCli;

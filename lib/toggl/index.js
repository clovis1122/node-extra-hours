'use strict';

const togglService = {};

// Dependencies

togglService._httpsHelper = require('../helper/https');
togglService._dateHelper = require('../helper/date');
togglService._config = require('../../config');
togglService._report = require('./report');

togglService._getProjectNamesByids = function(projectIds, togglOptions) {
  return Promise.all(projectIds.map(async (projectId) => {
    const togglUrl = togglService._config['TOGGL_PROJECTS_URL']+'/'+projectId;
    const res = await togglService._httpsHelper.makeRequestAsync(togglUrl, togglOptions);
    if (res.statusCode !== 200) throw new Error(
      'Error getting project name from the Toggl API. The project ID was:'+projectId,
    );

    const responseData = await togglService._httpsHelper.parseResponseData(res);
    const { data } = JSON.parse(responseData);

    return { projectId, name: data.name };
  }));
};

togglService.getUserEntriesFromToggl = async function(options) {
  const date = togglService._dateHelper.daysAgo(options.daysAgo).toISOString();
  const togglUrl = togglService._config['TOGGL_ENTRIES_URL']+'?start_date='+date;
  const togglOptions = {
    auth: `${options.apiToken}:api_token`,
    headers: { 'Content-Type': 'application/json' }
  };

  const res = await togglService._httpsHelper.makeRequestAsync(togglUrl, togglOptions);
  if (res.statusCode !== 200) throw new Error('Error connecting to Toggl API.');

  const responseData = await togglService._httpsHelper.parseResponseData(res);
  const entries = JSON.parse(responseData);
  const projectIds = [...new Set(entries.map(entry => entry.pid).filter(Boolean))];
  const projectPromise = togglService._getProjectNamesByids(projectIds, togglOptions);

  const filteredEntries = entries.filter(entry => entry.tags && entry.tags.includes('Extra'));
  const projectObjects = togglService._report.processTogglData(filteredEntries);

  const projectNames = (await projectPromise).reduce((projects, project) => {
    projects[project.projectId] = project.name;
    return projects;
  }, {});

  return projectObjects.map(project => ({...project, name: projectNames[project.name] }));
}

module.exports = togglService;

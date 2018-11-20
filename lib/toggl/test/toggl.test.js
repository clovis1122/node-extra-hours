'use strict';

const fs = require('fs');

describe('Toggl suite', function() {
  test('Toggl returns the user\'s entries', async function() {
    const toggl = require('../index');
    const apiToken = 'abc123';

    toggl._httpsHelper = {
      makeRequestAsync: () => ({ statusCode: 200 }),
      parseResponseData: () => fs.readFileSync(__dirname+'/data/entries.json')
    };

    toggl._getProjectNamesByids = function(projectIds) {
      return projectIds.map(projectId => ({ projectId, name: 'foo' }));
    };

    return toggl.getUserEntriesFromToggl({ apiToken, daysAgo: 5 }).then((projects) => {
      expect(projects.length).toBe(1);
      const [project] = projects;

      expect(project.name).toBe('foo');
      expect(project.nightly).toBe(0);
      expect(project.weekday.toFixed(2)).toBe('6.33');
      expect(project.weekend).toBe(0);

    });
  });

  test('Toggl takes the project PID and returns the project with it\'s name', async function() {
    const toggl = require('../index');
    const projectIds = [20981142, 20981146];
    const togglOptions = {
      auth: 'abc123:api_token',
      headers: { 'Content-Type': 'application/json' }
    };

    toggl._httpsHelper = {
      makeRequestAsync: () => ({ statusCode: 200 }),
      parseResponseData: () => fs.readFileSync(__dirname+'/data/projects.json')
    };

    return toggl._getProjectNamesByids(projectIds, togglOptions).then((projects) => {
      expect(projects.length).toBe(2);

      for (const project of projects) {
        expect(projectIds.includes(project.projectId)).toBe(true);
        expect(typeof(project.name)).toBe('string');
      }

    });
  });
  
});
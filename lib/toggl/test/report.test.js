'use strict';

const report = require('../report');

describe('Toggl report module suite', function() {
  test('Toggl report module processes the user entries', function() {
    const entries = [
      {
        'id': '11',
        'guid': 'sdsadde',
        'wid': 'dasdade',
        'pid': 'dadas',
        'tid': '1231ds',
        'billable': 'false',
        'start': '2018-11-01T14:50:00+00:00',
        'stop': '2018-11-01T21:10:00+00:00',
        'duration': '22800',
        'description': 'Test',
        'tags': [ 'Extra' ],
        'duronly': 'false',
        'at': '2018-11-02T13:06:59+00:00',
        'uid': 'sd'
      }
    ];

    const projects = report.processTogglData(entries);

    expect(projects.length).toBe(1);
    const [project] = projects;

    expect(project.name).toBe('dadas');
    expect(project.nightly).toBe(0);
    expect(project.weekday.toFixed(2)).toBe('6.33');
    expect(project.weekend).toBe(0);
  });

  test('Toggl report module slices nighly entries and sum to the nighly hours', function() {
    const entries = [
      {
        'id': '11',
        'guid': 'sdsadde',
        'wid': 'dasdade',
        'pid': 'dadas',
        'tid': '1231ds',
        'billable': 'false',
        'start': '2018-11-01T00:50:00+00:00',
        'stop': '2018-11-01T05:10:00+00:00',
        'duration': '22800',
        'description': 'Test',
        'tags': [ 'Extra' ],
        'duronly': 'false',
        'at': '2018-11-02T13:06:59+00:00',
        'uid': 'sd'
      }
    ];

    const projects = report.processTogglData(entries);

    expect(projects.length).toBe(1);
    const [project] = projects;
    
    expect(project.weekend).toBe(0);
    expect(project.weekday.toFixed(2)).toBe('4.33');
    expect(project.nightly.toFixed(2)).toBe('4.17');
    expect(project.dates.length).toBe(1);

    const [date] = project.dates;
    expect(date.entries.length).toBe(2);

  });

  test('Toggl report module sums the currect amount of hours', function() {
    const entries = [
      {
        'id': '11',
        'guid': 'sdsadde',
        'wid': 'dasdade',
        'pid': 'dadas',
        'tid': '1231ds',
        'billable': 'false',
        'start': '2018-11-01T01:50:00+00:00',
        'stop': '2018-11-01T08:10:00+00:00',
        'duration': '22800',
        'description': 'Test',
        'tags': [ 'Extra' ],
        'duronly': 'false',
        'at': '2018-11-02T13:06:59+00:00',
        'uid': 'sd'
      },
      {
        'id': '12',
        'guid': 'sdsadde',
        'wid': 'dasdade',
        'pid': 'dadas',
        'tid': '1231ds',
        'billable': 'false',
        'start': '2018-11-02T01:50:00+00:00',
        'stop': '2018-11-02T08:10:00+00:00',
        'duration': '22800',
        'description': 'Test',
        'tags': [ 'Extra' ],
        'duronly': 'false',
        'at': '2018-11-02T13:06:59+00:00',
        'uid': 'sd'
      },
    ];

    const projects = report.processTogglData(entries);

    expect(projects.length).toBe(1);
    const [project] = projects;
    
    expect(project.weekend).toBe(0);
    expect(project.weekday.toFixed(2)).toBe('12.67');
    expect(project.nightly.toFixed(2)).toBe('12.67');
    expect(project.dates.length).toBe(2);
  });

});

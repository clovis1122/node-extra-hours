'use strict';

const report = {};

// Dependencies

report._dateHelper = require('../helper/date');

report._NIGHT_START_HOUR = 1;
report._NIGHT_END_HOUR = 10;

report._overlapDates = function(startDate, endDate) {
  const startDay = startDate.getUTCDate();
  const endDay = endDate.getUTCDate();
  const startBeforeNight = startDate.getUTCHours() < report._NIGHT_START_HOUR || startDay < endDay;
  const endAfterNight = endDate.getUTCHours() >= report._NIGHT_START_HOUR;
  const startBeforeEndOfNight = startDate.getUTCHours() < report._NIGHT_END_HOUR;
  const endAfterEndOfNight = endDate.getUTCHours() > report._NIGHT_END_HOUR || endDay > startDay;

  return {
    overlapStartDate: startBeforeNight && endAfterNight,
    overlapEndDate: startBeforeEndOfNight && endAfterEndOfNight,
    isNightRange: startBeforeEndOfNight && endAfterNight,
  };
};

report._splitNightHours = function(entries) {
  let newEntries = [];

  // 8PM-10PM

  for (const entry of entries) {
    const startDate = new Date(entry.start);
    const endDate = new Date(entry.stop);

    const { overlapStartDate } = report._overlapDates(startDate, endDate);

    if (!overlapStartDate) {
      newEntries.push(entry);
      continue;
    }

    const newEntry = { ...entry };

    // Set the limit for the old entry
    const previousDate = new Date(endDate);
    previousDate.setUTCHours(report._NIGHT_START_HOUR - 1, 59, 59, 999);

    entry.stop = previousDate.toISOString();
    entry.duration = (new Date(entry.stop) - new Date(entry.start)) / 1000;

    // Set the limit for the new entry
    const newDate = new Date(endDate);
    newDate.setUTCHours(report._NIGHT_START_HOUR, 0, 0, 0);

    newEntry.start = newDate.toISOString();
    newEntry.duration = (new Date(newEntry.stop) - new Date(newEntry.start)) / 1000;

    newEntries.push(entry, newEntry);
  }

  // 4AM-8AM

  const newEntriesList = [];

  for (const entry of newEntries) {
    const startDate = new Date(entry.start);
    const endDate = new Date(entry.stop);

    const { overlapEndDate } = report._overlapDates(startDate, endDate);

    if (!overlapEndDate) {
      newEntriesList.push(entry);
      continue;
    }

    const newEntry = { ...entry };

    // Set the limit for the old entry
    const previousDate = new Date(startDate);
    previousDate.setUTCHours(report._NIGHT_END_HOUR - 1, 59, 59, 999);

    entry.stop = previousDate.toISOString();
    entry.duration = (new Date(entry.stop) - new Date(entry.start)) / 1000;

    // Set the limit for the new entry
    const newDate = new Date(startDate);
    newDate.setUTCHours(report._NIGHT_END_HOUR, 0, 0, 0);

    newEntry.start = newDate.toISOString();
    newEntry.duration = (new Date(newEntry.stop) - new Date(newEntry.start)) / 1000;

    newEntriesList.push(entry, newEntry);
  }

  return newEntriesList.map(entry => ({
    ...entry,
    isNight: report._overlapDates(new Date(entry.start), new Date(entry.stop)).isNightRange,
  }));
}

report.processTogglData = function(entries) {
  const timeEntries = {};
  const newEntries = report._splitNightHours(entries);

  for (const entry of newEntries) {
    const projectIndex = entry.pid;
    const formattedDate = report._dateHelper.formatWithDay(entry.start);
    if (timeEntries[projectIndex] == null) {
      timeEntries[projectIndex] = {
        name: projectIndex,
        dates: {},
        nightly: 0,
        weekday: 0,
        weekend: 0
      };
    }

    const projectObject = timeEntries[projectIndex];

    if (projectObject.dates[formattedDate] == null) {
      projectObject.dates[formattedDate] = { name: formattedDate, entries: [] };
    }

    const isNightHour = entry.isNight;
    const isWeekend = report._dateHelper.isWeekend(entry.start);
    const duration = report._dateHelper.secondsToHour(entry.duration);

    if (isNightHour) projectObject.nightly += duration;
    if (isWeekend) projectObject.weekend += duration;
    else projectObject.weekday += duration;

    projectObject.dates[formattedDate].entries.push({
      start: report._dateHelper.format12hour(entry.start),
      stop: report._dateHelper.format12hour(entry.stop),
      description: entry.description,
      isNight: isNightHour
    });
  }

  return Object
    .values(timeEntries)
    .map(project => ({ ...project, dates: Object.values(project.dates) }));
}

module.exports = report;

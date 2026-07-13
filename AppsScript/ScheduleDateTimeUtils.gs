function roundMinutesUpToStep(minutes, stepMinutes) {
  return Math.ceil(minutes / stepMinutes) * stepMinutes;
}

function formatScheduleTime(value) {
  if (!value) {
    return '';
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      'HH:mm'
    );
  }

  return String(value).trim();
}

function getWeekDayByCode(dayCode) {
  const days = getWeekDays();

  return days.find(function(day) {
    return day.day_code === dayCode;
  });
}

function isValidTimeValue(value) {
  const text = String(value || '').trim();

  const match = text.match(/^([01]\d|2[0-3]):([0-5]\d)$/);

  return !!match;
}

function timeValueToMinutes(value) {
  const text = normalizeTimeValue(value);

  const parts = text.split(':');

  return Number(parts[0]) * 60 + Number(parts[1]);
}

function normalizeTimeValue(value) {
  return String(value || '').trim();
}

function isValidDateValue(value) {
  const text = String(value || '').trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return false;
  }

  const date = new Date(text + 'T00:00:00');

  return !isNaN(date.getTime());
}

function parseDateFromDisplayText(text, settings) {
  const value = String(text || '').trim();

  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

  if (!match) {
    return '';
  }

  const day = match[1];
  const month = match[2];
  const year = match[3];

  return year + '-' + month + '-' + day;
}

function getWeekDayCode(date) {
  const day =
    date.getDay();

  const codes = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT'
  ];

  return codes[day];
}

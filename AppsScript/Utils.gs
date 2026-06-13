function formatDateForStorage(date) {
  return Utilities.formatDate(
    date,
    getSettings().TimeZone || 'Europe/Kyiv',
    'yyyy-MM-dd'
  );
}

function getRelativeDateByMessageKey(messageKey) {
  const today = new Date();
  const result = new Date(today);

  if (messageKey === MESSAGE_KEYS.TODAY) {
    return formatDateForStorage(result);
  }

  if (messageKey === MESSAGE_KEYS.TOMORROW) {
    result.setDate(result.getDate() + 1);
    return formatDateForStorage(result);
  }

  if (messageKey === MESSAGE_KEYS.DAY_AFTER_TOMORROW) {
    result.setDate(result.getDate() + 2);
    return formatDateForStorage(result);
  }

  return '';
}

function formatDateForDisplay(value) {
  const settings = getSettings();
  const timezone = settings.TimeZone || 'Europe/Kyiv';

  if (!value) {
    return '';
  }

  const date = new Date(value);

  return Utilities.formatDate(
    date,
    timezone,
    'dd.MM.yyyy'
  );
}

function formatDateForDisplay(value) {
  const settings = getSettings();
  const timezone = settings.TimeZone || 'Europe/Kyiv';

  if (!value) {
    return '';
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, timezone, 'dd.MM.yyyy');
  }

  const stringValue = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
    const parts = stringValue.split('-');
    return parts[2] + '.' + parts[1] + '.' + parts[0];
  }

  const date = new Date(stringValue);

  if (!isNaN(date.getTime())) {
    return Utilities.formatDate(date, timezone, 'dd.MM.yyyy');
  }

  return stringValue;
}

function isValidTimeOption(value) {
  const allowedTimes = [
    '07:00', '07:30',
    '08:00', '08:30',
    '09:00', '09:30',
    '10:00', '10:30',
    '11:00', '11:30',
    '12:00', '12:30',
    '13:00', '13:30',
    '14:00', '14:30',
    '15:00', '15:30',
    '16:00', '16:30',
    '17:00', '17:30',
    '18:00', '18:30',
    '19:00', '19:30',
    '20:00'
  ];

  return allowedTimes.indexOf(String(value).trim()) !== -1;
}

function formatTimeForDisplay(value) {
  const settings = getSettings();
  const timezone = settings.TimeZone || 'Europe/Kyiv';

  if (!value) {
    return '';
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, timezone, 'HH:mm');
  }

  const stringValue = String(value).trim();

  const match = stringValue.match(/\b\d{1,2}:\d{2}\b/);

  if (match) {
    return match[0];
  }

  return stringValue;
}

function buildDateTime(dateValue, timeValue) {
  const settings = getSettings();
  const timezone = settings.TimeZone || 'Europe/Kyiv';

  const dateString = formatDateForStorage(dateValue);
  const timeString = formatTimeForDisplay(timeValue);

  return dateString + ' ' + timeString;
}


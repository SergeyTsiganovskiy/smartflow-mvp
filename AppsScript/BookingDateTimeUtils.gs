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

function addDaysToDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDateButton(value) {
  const timezone = getSettings().TimeZone || 'Europe/Kyiv';

  return Utilities.formatDate(
    value,
    timezone,
    'dd.MM.yyy'
  );
}

function parseCustomDateButton(text) {
  const value = String(text || '').trim();

  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

  if (!match) {
    return '';
  }

  const day = match[1];
  const month = match[2];
  const year = match[3];

  const dateString =
    year + '-' + month + '-' + day;

  const parsed =
    new Date(dateString + 'T12:00:00');

  return normalizeDateForStorage(parsed);
}

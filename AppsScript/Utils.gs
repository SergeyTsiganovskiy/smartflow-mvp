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
  const timezone = getSettings().TimeZone || 'Europe/Kyiv';

  if (!value) {
    return '';
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, timezone, 'HH:mm');
  }

  const stringValue = String(value).trim();

  const match = stringValue.match(/\b\d{1,2}:\d{2}\b/);

  if (match) {
    return match[0].padStart(5, '0');
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

function normalizeDateForStorage(value) {
  const timezone = getSettings().TimeZone || 'Europe/Kyiv';

  if (!value) {
    return '';
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, timezone, 'yyyy-MM-dd');
  }

  const text = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  let match = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (match) {
    return (
      match[3] + '-' +
      String(match[2]).padStart(2, '0') + '-' +
      String(match[1]).padStart(2, '0')
    );
  }

  match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const first = Number(match[1]);
    const second = Number(match[2]);

    // If first number is > 12, assume DD/MM/YYYY.
    // Otherwise assume MM/DD/YYYY.
    if (first > 12) {
      return (
        match[3] + '-' +
        String(second).padStart(2, '0') + '-' +
        String(first).padStart(2, '0')
      );
    }

    return (
      match[3] + '-' +
      String(first).padStart(2, '0') + '-' +
      String(second).padStart(2, '0')
    );
  }

  const parsed = new Date(text);

  if (!isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, timezone, 'yyyy-MM-dd');
  }

  return '';
}

function normalizeTimeForStorage(value) {
  const timezone = getSettings().TimeZone || 'Europe/Kyiv';

  if (!value) {
    return '';
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, timezone, 'HH:mm');
  }

  const text = String(value).trim();

  let match = text.match(/^(\d{1,2})[:.](\d{2})$/);

  if (match) {
    return (
      String(match[1]).padStart(2, '0') +
      ':' +
      match[2]
    );
  }

  match = text.match(/^(\d{1,2})$/);

  if (match) {
    return String(match[1]).padStart(2, '0') + ':00';
  }

  return '';
}

function getDayOfWeekCode(dateValue) {
  const timezone = getSettings().TimeZone || 'Europe/Kyiv';
  const normalizedDate = normalizeDateForStorage(dateValue);

  const date = new Date(normalizedDate + 'T12:00:00');

  const dayIndex = Number(
    Utilities.formatDate(date, timezone, 'u')
  );

  const codes = {
    1: 'MON',
    2: 'TUE',
    3: 'WED',
    4: 'THU',
    5: 'FRI',
    6: 'SAT',
    7: 'SUN'
  };

  return codes[dayIndex];
}

function timeToMinutes(timeString) {
  const parts = String(timeString).split(':');

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    String(hours).padStart(2, '0') +
    ':' +
    String(minutes).padStart(2, '0')
  );
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
    'dd.MM'
  );
}

function parseCustomDateButton(text) {
  const timezone = getSettings().TimeZone || 'Europe/Kyiv';
  const value = String(text).trim();

  const match = value.match(/^(\d{2})\.(\d{2})$/);

  if (!match) {
    return '';
  }

  const today = new Date();
  const currentYear = Number(
    Utilities.formatDate(today, timezone, 'yyyy')
  );

  const day = match[1];
  const month = match[2];

  let dateString = currentYear + '-' + month + '-' + day;

  let parsed = new Date(dateString + 'T12:00:00');

  const todayStorage = normalizeDateForStorage(today);
  let parsedStorage = normalizeDateForStorage(parsed);

  if (parsedStorage < todayStorage) {
    dateString = (currentYear + 1) + '-' + month + '-' + day;
    parsed = new Date(dateString + 'T12:00:00');
    parsedStorage = normalizeDateForStorage(parsed);
  }

  return parsedStorage;
}

function extractTimeFromDateTime(value) {
  if (!value) {
    return '';
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(
      value,
      getSettings().TimeZone || 'Europe/Kyiv',
      'HH:mm'
    );
  }

  const text = String(value).trim();
  const match = text.match(/\b\d{1,2}:\d{2}\b/);

  if (match) {
    return match[0].padStart(5, '0');
  }

  return '';
}

function addMinutesToDateTime(dateTimeValue, minutesToAdd) {
  const timezone = getSettings().TimeZone || 'Europe/Kyiv';

  const text = String(dateTimeValue).trim();

  const match = text.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2})$/);

  if (!match) {
    return '';
  }

  const datePart = match[1];
  const timePart = match[2];

  const timeMinutes = timeToMinutes(timePart);
  const resultMinutes = timeMinutes + Number(minutesToAdd);

  const resultDate = new Date(datePart + 'T12:00:00');
  const extraDays = Math.floor(resultMinutes / (24 * 60));
  const finalMinutes = resultMinutes % (24 * 60);

  resultDate.setDate(resultDate.getDate() + extraDays);

  const finalDate = Utilities.formatDate(
    resultDate,
    timezone,
    'yyyy-MM-dd'
  );

  return finalDate + ' ' + minutesToTime(finalMinutes);
}

function parseDateTimeForCalendar(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return value;
  }

  const text = String(value).trim();

  const match = text.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2})$/);

  if (!match) {
    throw new Error('Invalid datetime: ' + text);
  }

  return new Date(match[1] + 'T' + match[2] + ':00');
}

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');

  if (digits.length === 9) {
    return '0' + digits;
  }

  return digits;
}

function isValidPhone(phone) {
  const normalized = normalizePhone(phone);
  return normalized.length >= 7;
}

function getPhoneSearchKey(phone) {
  const normalized = normalizePhone(phone);

  if (normalized.length >= 9) {
    return normalized.slice(-9);
  }

  return normalized;
}

function formatDateTimeForDisplay(value) {
  if (!value) {
    return '';
  }

  const date = formatDateForDisplay(value);
  const time = formatTimeForDisplay(value);

  if (date && time) {
    return date + ' ' + time;
  }

  return String(value);
}

function isSameDate(dateValue1, dateValue2) {
  return normalizeDateForStorage(dateValue1) === normalizeDateForStorage(dateValue2);
}

function getCurrentTimeMinutes() {
  const timezone = getSettings().TimeZone || 'Europe/Kyiv';
  const now = new Date();

  const currentTime = Utilities.formatDate(
    now,
    timezone,
    'HH:mm'
  );

  return timeToMinutes(currentTime);
}

function buildDateTime(dateValue, timeValue) {
  const dateString = normalizeDateForStorage(dateValue);
  const timeString = formatTimeForDisplay(timeValue);

  if (!dateString || !timeString) {
    throw new Error(
      'buildDateTime: invalid date/time: ' +
      String(dateValue) +
      ' / ' +
      String(timeValue)
    );
  }

  return dateString + ' ' + timeString;
}

function extractPhoneFromText(text) {
  const value = String(text || '');

  const match = value.match(/(?:Phone|Телефон|Тел|Phone number)\s*[:\-]?\s*([+\d\s().-]{7,20})/i);

  if (match) {
    return normalizePhone(match[1]);
  }

  const fallback = value.match(/(\+?\d[\d\s().-]{6,18}\d)/);

  if (fallback) {
    return normalizePhone(fallback[1]);
  }

  return '';
}

function extractFieldFromText(text, fieldName) {
  const value = String(text || '');

  const regex = new RegExp(
    fieldName + '\\s*[:\\-]\\s*(.+)',
    'i'
  );

  const match = value.match(regex);

  if (match) {
    return String(match[1]).trim();
  }

  return '';
}

function formatDateTimeForStorage(value) {
  if (!value) {
    return '';
  }

  const timezone =
    getSettings().TimeZone || 'Europe/Kyiv';

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(
      value,
      timezone,
      'yyyy-MM-dd HH:mm'
    );
  }

  const stringValue = String(value).trim();

  const date = normalizeDateForStorage(stringValue);
  const time = formatTimeForDisplay(stringValue);

  if (date && time) {
    return date + ' ' + time;
  }

  return stringValue;
}
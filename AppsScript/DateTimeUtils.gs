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

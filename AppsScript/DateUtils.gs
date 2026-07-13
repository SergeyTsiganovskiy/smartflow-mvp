function formatDateForStorage(date) {
  return Utilities.formatDate(
    date,
    getSettings().TimeZone || 'Europe/Kyiv',
    'yyyy-MM-dd'
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

function isSameDate(dateValue1, dateValue2) {
  return normalizeDateForStorage(dateValue1) === normalizeDateForStorage(dateValue2);
}

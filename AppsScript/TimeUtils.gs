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
    return String(match[1]).padStart(2, '0') + ':' + match[2];
  }

  match = text.match(/^(\d{1,2})$/);

  if (match) {
    return String(match[1]).padStart(2, '0') + ':00';
  }

  return '';
}

function timeToMinutes(value) {
  if (value instanceof Date) {
    return value.getHours() * 60 + value.getMinutes();
  }

  const parts = String(value || '').split(':');

  if (parts.length < 2) {
    return 0;
  }

  return Number(parts[0]) * 60 + Number(parts[1]);
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
}

function extractTimeFromDateTime(value) {
  if (!value) {
    return '';
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, getSettings().TimeZone || 'Europe/Kyiv', 'HH:mm');
  }

  const text = String(value).trim();
  const match = text.match(/\b\d{1,2}:\d{2}\b/);

  if (match) {
    return match[0].padStart(5, '0');
  }

  return '';
}

function getCurrentTimeMinutes() {
  const timezone = getSettings().TimeZone || 'Europe/Kyiv';
  const now = new Date();

  const currentTime = Utilities.formatDate(now, timezone, 'HH:mm');

  return timeToMinutes(currentTime);
}

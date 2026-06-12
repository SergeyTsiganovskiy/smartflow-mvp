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

function formatPeriodForDisplay(periodKey) {
  if (periodKey === MESSAGE_KEYS.MORNING) {
    return getMessage(MESSAGE_KEYS.MORNING);
  }

  if (periodKey === MESSAGE_KEYS.AFTERNOON) {
    return getMessage(MESSAGE_KEYS.AFTERNOON);
  }

  if (periodKey === MESSAGE_KEYS.EVENING) {
    return getMessage(MESSAGE_KEYS.EVENING);
  }

  return periodKey;
}
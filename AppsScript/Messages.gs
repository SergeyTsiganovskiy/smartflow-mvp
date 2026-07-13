let MESSAGES_CACHE = null;

function resetMessagesCache() {
  MESSAGES_CACHE = null;
}

function getMessage(messageKey, language) {
  if (!MESSAGES_CACHE) {
    MESSAGES_CACHE = loadMessagesCache();
  }

  const lang = String(language || getSettings().Language || 'ru').trim();

  if (MESSAGES_CACHE[messageKey] && MESSAGES_CACHE[messageKey][lang]) {
    return MESSAGES_CACHE[messageKey][lang];
  }

  return messageKey;
}

function loadMessagesCache() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.MESSAGES);

  const rows = sheet.getDataRange().getValues();

  const cache = {};

  if (rows.length < 2) {
    return cache;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const keyIndex = headers.indexOf('key');

  for (let i = 1; i < rows.length; i++) {
    const key = String(rows[i][keyIndex] || '').trim();

    if (!key) {
      continue;
    }

    cache[key] = {};

    headers.forEach(function (header, index) {
      if (header === 'key') {
        return;
      }

      cache[key][header] = rows[i][index] || '';
    });
  }

  return cache;
}

function getMessageKeyByText(text) {
  if (!MESSAGES_CACHE) {
    MESSAGES_CACHE = loadMessagesCache();
  }

  const settings = getSettings();
  const lang = settings.Language || 'ru';
  const targetText = String(text || '').trim();

  for (const key in MESSAGES_CACHE) {
    const messageText = String(MESSAGES_CACHE[key][lang] || '').trim();

    if (messageText === targetText) {
      return key;
    }
  }

  return '';
}

function getMessageValues(messageKey) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.MESSAGES);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const keyIndex = headers.indexOf('key');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][keyIndex]) === String(messageKey)) {
      return headers
        .filter(function (header) {
          return header !== 'key';
        })
        .map(function (header) {
          return String(rows[i][headers.indexOf(header)] || '').trim();
        })
        .filter(function (value) {
          return value;
        });
    }
  }

  return [];
}

function isMessageText(text, messageKey) {
  if (!MESSAGES_CACHE) {
    MESSAGES_CACHE = loadMessagesCache();
  }

  const targetText = String(text || '').trim();
  const values = MESSAGES_CACHE[messageKey] || {};

  for (const language in values) {
    if (String(values[language] || '').trim() === targetText) {
      return true;
    }
  }

  return false;
}

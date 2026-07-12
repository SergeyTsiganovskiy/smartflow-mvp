let MESSAGES_CACHE = null;

function getMessage(messageKey) {
  if (!MESSAGES_CACHE) {
    MESSAGES_CACHE = loadMessagesCache();
  }

  const lang = getSettings().Language || 'ru';

  if (
    MESSAGES_CACHE[messageKey] &&
    MESSAGES_CACHE[messageKey][lang]
  ) {
    return MESSAGES_CACHE[messageKey][lang];
  }

  return messageKey;
}

function loadMessagesCache() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.MESSAGES);

  const rows = sheet.getDataRange().getValues();

  const cache = {};

  if (rows.length < 2) {
    return cache;
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const keyIndex = headers.indexOf('key');

  for (let i = 1; i < rows.length; i++) {
    const key = String(rows[i][keyIndex] || '').trim();

    if (!key) {
      continue;
    }

    cache[key] = {};

    headers.forEach(function(header, index) {
      if (header === 'key') {
        return;
      }

      cache[key][header] =
        rows[i][index] || '';
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
    const messageText =
      String(MESSAGES_CACHE[key][lang] || '').trim();

    if (messageText === targetText) {
      return key;
    }
  }

  return '';
}

function getMessageValues(messageKey) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.MESSAGES);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const keyIndex = headers.indexOf('key');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][keyIndex]) === String(messageKey)) {
      return headers
        .filter(function(header) {
          return header !== 'key';
        })
        .map(function(header) {
          return String(rows[i][headers.indexOf(header)] || '').trim();
        })
        .filter(function(value) {
          return value;
        });
    }
  }

  return [];
}
function createOrUpdateMessageValues(messageKey, valuesByLang) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.MESSAGES);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const keyIndex = headers.indexOf('key');

  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][keyIndex]) === String(messageKey)) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex === -1) {
    const newRow = headers.map(function(header) {
      if (header === 'key') {
        return messageKey;
      }

      return valuesByLang[header] || '';
    });

    sheet.appendRow(newRow);
    return;
  }

  headers.forEach(function(header, index) {
    if (header === 'key') {
      return;
    }

    if (valuesByLang[header] !== undefined) {
      sheet
        .getRange(rowIndex, index + 1)
        .setValue(valuesByLang[header]);
    }
  });
}

function createMessageValuesForAllLanguages(value) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.MESSAGES);

  const headers =
    sheet.getDataRange().getValues()[0];

  const result = {};

  headers.forEach(function(header) {
    const columnName =
      String(header).trim();

    if (columnName === 'key') {
      return;
    }

    result[columnName] = value;
  });

  return result;
}

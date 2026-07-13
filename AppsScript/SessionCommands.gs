function setUserSessionValue(telegramId, fieldName, value) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.USER_SESSIONS);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const telegramIndex = headers.indexOf('telegram_id');
  const updatedAtIndex = headers.indexOf('updated_at');
  const sessionDataIndex = headers.indexOf('session_data');

  if (sessionDataIndex === -1) {
    throw new Error('Field not found in UserSessions: session_data');
  }

  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][telegramIndex]) === String(telegramId)) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex === -1) {
    const newRow = new Array(headers.length).fill('');

    newRow[telegramIndex] = String(telegramId);
    newRow[sessionDataIndex] = '{}';

    if (updatedAtIndex !== -1) {
      newRow[updatedAtIndex] = new Date();
    }

    sheet.appendRow(newRow);
    rowIndex = sheet.getLastRow();
  }

  const currentJsonText = sheet.getRange(rowIndex, sessionDataIndex + 1).getValue();

  let sessionData = {};

  if (currentJsonText) {
    try {
      sessionData = JSON.parse(currentJsonText);
    } catch (error) {
      addAuditLog('SESSION_JSON_PARSE_ERROR', String(error));

      sessionData = {};
    }
  }

  sessionData[fieldName] = value;

  sheet.getRange(rowIndex, sessionDataIndex + 1).setValue(JSON.stringify(sessionData));

  if (updatedAtIndex !== -1) {
    sheet.getRange(rowIndex, updatedAtIndex + 1).setValue(new Date());
  }
}

function setUserSessionValues(telegramId, values) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.USER_SESSIONS);

  const rows = sheet.getDataRange().getValues();

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const telegramIndex = headers.indexOf('telegram_id');

  const sessionDataIndex = headers.indexOf('session_data');

  const updatedAtIndex = headers.indexOf('updated_at');

  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][telegramIndex]) === String(telegramId)) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex === -1) {
    const newRow = new Array(headers.length).fill('');

    newRow[telegramIndex] = String(telegramId);

    newRow[sessionDataIndex] = '{}';

    sheet.appendRow(newRow);

    rowIndex = sheet.getLastRow();
  }

  let sessionData = {};

  const jsonText = sheet.getRange(rowIndex, sessionDataIndex + 1).getValue();

  if (jsonText) {
    try {
      sessionData = JSON.parse(jsonText);
    } catch (error) {
      sessionData = {};
    }
  }

  Object.keys(values).forEach(function (key) {
    sessionData[key] = values[key];
  });

  sheet.getRange(rowIndex, sessionDataIndex + 1).setValue(JSON.stringify(sessionData));

  if (updatedAtIndex !== -1) {
    sheet.getRange(rowIndex, updatedAtIndex + 1).setValue(new Date());
  }
}

function clearUserSession(telegramId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.USER_SESSIONS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const telegramIndex = headers.indexOf('telegram_id');
  const sessionDataIndex = headers.indexOf('session_data');
  const updatedAtIndex = headers.indexOf('updated_at');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][telegramIndex]) === String(telegramId)) {
      if (sessionDataIndex !== -1) {
        sheet.getRange(i + 1, sessionDataIndex + 1).setValue('{}');
      }

      if (updatedAtIndex !== -1) {
        sheet.getRange(i + 1, updatedAtIndex + 1).setValue(new Date());
      }

      return;
    }
  }
}

function clearUserSessionOptions(telegramId) {
  setUserSessionValues(telegramId, {
    option_count: 0,
    current_option_date: '',
    current_option_time: '',
    option1_date: '',
    option1_time: '',
    option2_date: '',
    option2_time: '',
    option3_date: '',
    option3_time: ''
  });
}

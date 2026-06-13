function setUserState(telegramId, state) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('UserStates');

  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(telegramId)) {
      sheet.getRange(i + 1, 2).setValue(state);
      sheet.getRange(i + 1, 3).setValue(new Date());
      return;
    }
  }

  sheet.appendRow([
    telegramId,
    state,
    new Date()
  ]);
}

function getUserState(telegramId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('UserStates');

  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(telegramId)) {
      return rows[i][1];
    }
  }

  return '';
}

function setUserSessionValue(telegramId, fieldName, value) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('UserSessions');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const telegramIndex = headers.indexOf('telegram_id');
  const fieldIndex = headers.indexOf(fieldName);
  const updatedIndex = headers.indexOf('updated_at');

  if (fieldIndex === -1) {
    throw new Error('Field not found in UserSessions: ' + fieldName);
  }

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][telegramIndex]) === String(telegramId)) {
      sheet.getRange(i + 1, fieldIndex + 1).setValue(value);
      sheet.getRange(i + 1, updatedIndex + 1).setValue(new Date());
      return;
    }
  }

  const newRow = new Array(headers.length).fill('');
  newRow[telegramIndex] = telegramId;
  newRow[fieldIndex] = value;
  newRow[updatedIndex] = new Date();

  sheet.appendRow(newRow);
}

function getLocations() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Locations');

  const rows = sheet.getDataRange().getValues();
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const active = String(rows[i][4]).toUpperCase();

    if (active === 'TRUE') {
      result.push({
        id: rows[i][0],
        name: String(rows[i][1]).trim()
      });
    }
  }

  return result;
}

function findLocationByName(locationName) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Locations');

  const rows = sheet.getDataRange().getValues();
  const targetName = String(locationName).trim();

  for (let i = 1; i < rows.length; i++) {
    const id = rows[i][0];
    const name = String(rows[i][1]).trim();
    const active = String(rows[i][4]).toUpperCase();

    if (name === targetName && active === 'TRUE') {
      return {
        id: id,
        name: name
      };
    }
  }

  return null;
}

function getServices() {
  const settings = getSettings();
  const lang = settings.Language || 'ru';

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Services');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idIndex = headers.indexOf('service_id');
  const nameIndex = headers.indexOf('name_' + lang);
  const activeIndex = headers.indexOf('active');

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const active = String(rows[i][activeIndex]).toUpperCase();

    if (active === 'TRUE') {
      result.push({
        id: rows[i][idIndex],
        name: rows[i][nameIndex]
      });
    }
  }

  return result;
}

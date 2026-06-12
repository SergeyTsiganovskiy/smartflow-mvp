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

  sheet.appendRow([telegramId, state, new Date()]);
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
  const settings = getSettings();
  const lang = settings.Language || 'ru';

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Locations');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idIndex = headers.indexOf('location_id');
  const nameIndex = headers.indexOf('name_' + lang);
  const activeIndex = headers.indexOf('active');

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const active = String(rows[i][activeIndex]).toUpperCase();

    if (active === 'TRUE') {
      result.push({
        id: rows[i][idIndex],
        name: String(rows[i][nameIndex]).trim()
      });
    }
  }

  return result;
}

function findLocationByName(locationName) {
  const settings = getSettings();
  const lang = settings.Language || 'ru';

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Locations');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idIndex = headers.indexOf('location_id');
  const nameIndex = headers.indexOf('name_' + lang);
  const activeIndex = headers.indexOf('active');

  const targetName = String(locationName).trim();

  for (let i = 1; i < rows.length; i++) {
    const name = String(rows[i][nameIndex]).trim();
    const active = String(rows[i][activeIndex]).toUpperCase();

    if (name === targetName && active === 'TRUE') {
      return {
        id: rows[i][idIndex],
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

function addAuditLog(action, details) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('AuditLog');

  sheet.appendRow([
    new Date(),
    action,
    details
  ]);
}

function findServiceByName(serviceName) {
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

  const targetName = String(serviceName).trim();

  for (let i = 1; i < rows.length; i++) {
    const name = String(rows[i][nameIndex]).trim();
    const active = String(rows[i][activeIndex]).toUpperCase();

    if (name === targetName && active === 'TRUE') {
      return {
        id: rows[i][idIndex],
        name: name
      };
    }
  }

  return null;
}

function getUserSession(telegramId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('UserSessions');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const telegramIndex = headers.indexOf('telegram_id');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][telegramIndex]) === String(telegramId)) {
      const session = {};

      headers.forEach((header, index) => {
        session[header] = rows[i][index];
      });

      return session;
    }
  }

  return null;
}

function getProvidersByLocation(locationId) {
  const settings = getSettings();
  const lang = settings.Language || 'ru';

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Providers');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idIndex = headers.indexOf('provider_id');
  const locationIndex = headers.indexOf('location_id');
  const nameIndex = headers.indexOf('name_' + lang);
  const activeIndex = headers.indexOf('active');

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const active = String(rows[i][activeIndex]).toUpperCase();

    if (
      String(rows[i][locationIndex]) === String(locationId) &&
      active === 'TRUE'
    ) {
      result.push({
        id: rows[i][idIndex],
        name: String(rows[i][nameIndex]).trim()
      });
    }
  }

  return result;
}

function findProviderByName(providerName) {
  const messageKey = getMessageKeyByText(providerName);

  if (messageKey === MESSAGE_KEYS.ANY_PROVIDER) {
    return {
      id: PROVIDER_IDS.ANY_PROVIDER,
      name: getMessage(MESSAGE_KEYS.ANY_PROVIDER)
    };
  }

  const settings = getSettings();
  const lang = settings.Language || 'ru';

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Providers');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idIndex = headers.indexOf('provider_id');
  const nameIndex = headers.indexOf('name_' + lang);
  const activeIndex = headers.indexOf('active');

  const targetName = String(providerName).trim();

  for (let i = 1; i < rows.length; i++) {
    const name = String(rows[i][nameIndex]).trim();
    const active = String(rows[i][activeIndex]).toUpperCase();

    if (name === targetName && active === 'TRUE') {
      return {
        id: rows[i][idIndex],
        name: name
      };
    }
  }

  return null;
}

function generateId(prefix) {
  return prefix + '_' + new Date().getTime();
}

function createOrUpdateCustomer(session) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Customers');

  const rows = sheet.getDataRange().getValues();

  const telegramId = session.telegram_id;
  const now = new Date();

  const name = String(session.customer_name || '').trim();
  const phone = String(session.customer_phone || '').trim();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1]) === String(telegramId)) {

      if (name) {
        sheet.getRange(i + 1, 3).setValue(name);
      }

      if (phone) {
        sheet.getRange(i + 1, 4).setValue(phone);
      }

      sheet.getRange(i + 1, 7).setValue(now);

      return rows[i][0];
    }
  }

  const customerId = generateId('cust');

  sheet.appendRow([
    customerId,
    telegramId,
    name,
    phone,
    getSettings().Language || 'ru',
    now,
    now,
    '',
    ''
  ]);

  return customerId;
}

function createRequest(customerId, session) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Requests');

  const requestId = generateId('req');

  sheet.appendRow([
    requestId,
    customerId,
    session.location_id,
    session.service_id,
    session.provider_id,
    'pending',
    new Date()
  ]);

  return requestId;
}

function createRequestOptions(requestId, session) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('RequestOptions');

  const now = new Date();

  for (let i = 1; i <= 3; i++) {
    const date = session['option' + i + '_date'];
    const period = session['option' + i + '_period'];

    if (date && period) {
      sheet.appendRow([
        generateId('opt'),
        requestId,
        date,
        period,
        i,
        'pending',
        now
      ]);
    }
  }
}

// function finalizeRequest(chatId) {
//   const session = getUserSession(chatId);
//   const customerId = createOrUpdateCustomer(session);
//   const requestId = createRequest(customerId, session);
//   createRequestOptions(requestId, session);
//   return requestId;
// }

function finalizeRequestFromSession(session) {
  const customerId = createOrUpdateCustomer(session);
  const requestId = createRequest(customerId, session);

  createRequestOptions(requestId, session);

  return requestId;
}

function findLocationById(locationId) {
  const settings = getSettings();
  const lang = settings.Language || 'ru';

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Locations');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idIndex = headers.indexOf('location_id');
  const nameIndex = headers.indexOf('name_' + lang);

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(locationId)) {
      return {
        id: rows[i][idIndex],
        name: rows[i][nameIndex]
      };
    }
  }

  return null;
}

function findServiceById(serviceId) {
  const settings = getSettings();
  const lang = settings.Language || 'ru';

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Services');
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idIndex = headers.indexOf('service_id');
  const nameIndex = headers.indexOf('name_' + lang);

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(serviceId)) {
      return {
        id: rows[i][idIndex],
        name: rows[i][nameIndex]
      };
    }
  }

  return null;
}

function findProviderById(providerId) {
  if (providerId === PROVIDER_IDS.ANY_PROVIDER) {
    return {
      id: PROVIDER_IDS.ANY_PROVIDER,
      name: getMessage(MESSAGE_KEYS.ANY_PROVIDER)
    };
  }

  const settings = getSettings();
  const lang = settings.Language || 'ru';

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Providers');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idIndex = headers.indexOf('provider_id');
  const nameIndex = headers.indexOf('name_' + lang);

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(providerId)) {
      return {
        id: rows[i][idIndex],
        name: rows[i][nameIndex]
      };
    }
  }

  return null;
}

function clearUserSessionOptions(telegramId) {
  setUserSessionValue(telegramId, 'option_count', 0);

  setUserSessionValue(telegramId, 'current_option_date', '');
  setUserSessionValue(telegramId, 'current_option_period', '');

  setUserSessionValue(telegramId, 'option1_date', '');
  setUserSessionValue(telegramId, 'option1_period', '');

  setUserSessionValue(telegramId, 'option2_date', '');
  setUserSessionValue(telegramId, 'option2_period', '');

  setUserSessionValue(telegramId, 'option3_date', '');
  setUserSessionValue(telegramId, 'option3_period', '');
}

function clearUserSession(telegramId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('UserSessions');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const telegramIndex = headers.indexOf('telegram_id');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][telegramIndex]) === String(telegramId)) {

      for (let col = 0; col < headers.length; col++) {
        if (col !== telegramIndex) {
          sheet.getRange(i + 1, col + 1).setValue('');
        }
      }

      return;
    }
  }
}
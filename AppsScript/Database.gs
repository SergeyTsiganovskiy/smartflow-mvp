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
  const headers = rows[0];

  const customerIdIndex = headers.indexOf('customer_id');
  const telegramIdIndex = headers.indexOf('telegram_id');
  const nameIndex = headers.indexOf('name');
  const phoneIndex = headers.indexOf('phone');
  const languageIndex = headers.indexOf('language');
  const createdAtIndex = headers.indexOf('created_at');
  const updatedAtIndex = headers.indexOf('updated_at');
  const lastVisitAtIndex = headers.indexOf('last_visit_at');
  const notesIndex = headers.indexOf('notes');
  const statusIndex = headers.indexOf('status');

  const telegramId = String(session.telegram_id || '').trim();
  const name = String(session.customer_name || '').trim();
  const phone = String(session.customer_phone || '').trim();
  const language = getSettings().Language || 'ru';
  const now = new Date();

  if (!phone) {
    throw new Error('createOrUpdateCustomer: customer_phone is empty');
  }

  if (!name) {
    throw new Error('createOrUpdateCustomer: customer_name is empty');
  }

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][phoneIndex]).trim() === phone) {
      sheet.getRange(i + 1, nameIndex + 1).setValue(name);

      if (telegramId) {
        sheet.getRange(i + 1, telegramIdIndex + 1).setValue(telegramId);
      }

      sheet.getRange(i + 1, languageIndex + 1).setValue(language);

      if (updatedAtIndex !== -1) {
        sheet.getRange(i + 1, updatedAtIndex + 1).setValue(now);
      }

      return rows[i][customerIdIndex];
    }
  }

  const newRow = new Array(headers.length).fill('');

  newRow[customerIdIndex] = generateId('cust');
  newRow[telegramIdIndex] = telegramId;
  newRow[nameIndex] = name;
  newRow[phoneIndex] = phone;
  newRow[languageIndex] = language;

  if (createdAtIndex !== -1) {
    newRow[createdAtIndex] = now;
  }

  if (updatedAtIndex !== -1) {
    newRow[updatedAtIndex] = now;
  }

  if (lastVisitAtIndex !== -1) {
    newRow[lastVisitAtIndex] = '';
  }

  if (notesIndex !== -1) {
    newRow[notesIndex] = '';
  }

  if (statusIndex !== -1) {
    newRow[statusIndex] = 'lead';
  }

  sheet.appendRow(newRow);

  return newRow[customerIdIndex];
}

function createRequest(customerId, session) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Requests');

  const headers = sheet.getDataRange().getValues()[0];

  const requestId = generateId('req');
  const now = new Date();

  const newRow = new Array(headers.length).fill('');

  newRow[headers.indexOf('request_id')] = requestId;
  newRow[headers.indexOf('customer_id')] = customerId;
  newRow[headers.indexOf('service_id')] = session.service_id;
  newRow[headers.indexOf('provider_id')] = session.provider_id;
  newRow[headers.indexOf('location_id')] = session.location_id;
  newRow[headers.indexOf('status')] = 'pending';
  newRow[headers.indexOf('created_at')] = now;

  sheet.appendRow(newRow);

  return requestId;
}

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
  setUserSessionValue(telegramId, 'current_option_time', '');

  setUserSessionValue(telegramId, 'option1_date', '');
  setUserSessionValue(telegramId, 'option1_time', '');

  setUserSessionValue(telegramId, 'option2_date', '');
  setUserSessionValue(telegramId, 'option2_time', '');

  setUserSessionValue(telegramId, 'option3_date', '');
  setUserSessionValue(telegramId, 'option3_time', '');
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

function getRequestById(requestId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Requests');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idIndex = headers.indexOf('request_id');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(requestId)) {
      const result = {};

      headers.forEach((header, index) => {
        result[header] = rows[i][index];
      });

      return result;
    }
  }

  return null;
}

function getCustomerById(customerId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Customers');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idIndex = headers.indexOf('customer_id');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(customerId)) {
      const result = {};

      headers.forEach((header, index) => {
        result[header] = rows[i][index];
      });

      return result;
    }
  }

  return null;
}

function getRequestOptionByPriority(requestId, priority) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('RequestOptions');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const requestIdIndex = headers.indexOf('request_id');
  const priorityIndex = headers.indexOf('priority');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][requestIdIndex]) === String(requestId) &&
      Number(rows[i][priorityIndex]) === Number(priority)
    ) {
      const result = {};

      headers.forEach((header, index) => {
        result[header] = rows[i][index];
      });

      return result;
    }
  }

  return null;
}

function createAppointmentFromRequest(request, option) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const headers = sheet.getDataRange().getValues()[0];

  const now = new Date();

  const appointmentId = generateId('appt');

  const startAt = buildDateTime(
    option.preferred_date,
    option.preferred_time
  );

  const endAt = '';

  const newRow = new Array(headers.length).fill('');

  newRow[headers.indexOf('appointment_id')] = appointmentId;
  newRow[headers.indexOf('request_id')] = request.request_id;
  newRow[headers.indexOf('customer_id')] = request.customer_id;
  newRow[headers.indexOf('service_id')] = request.service_id;
  newRow[headers.indexOf('provider_id')] = request.provider_id;
  newRow[headers.indexOf('location_id')] = request.location_id;
  newRow[headers.indexOf('start_at')] = startAt;
  newRow[headers.indexOf('end_at')] = endAt;
  newRow[headers.indexOf('status')] = 'confirmed';
  newRow[headers.indexOf('calendar_event_id')] = '';
  newRow[headers.indexOf('created_at')] = now;
  newRow[headers.indexOf('updated_at')] = now;

  sheet.appendRow(newRow);

  return appointmentId;
}

function updateRequestStatus(requestId, status) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Requests');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const requestIdIndex = headers.indexOf('request_id');
  const statusIndex = headers.indexOf('status');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][requestIdIndex]) === String(requestId)) {
      sheet.getRange(i + 1, statusIndex + 1).setValue(status);
      return;
    }
  }
}

function updateRequestOptionsAfterApproval(requestId, approvedPriority) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('RequestOptions');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const requestIdIndex = headers.indexOf('request_id');
  const priorityIndex = headers.indexOf('priority');
  const statusIndex = headers.indexOf('status');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][requestIdIndex]) === String(requestId)) {
      const status =
        Number(rows[i][priorityIndex]) === Number(approvedPriority)
          ? 'approved'
          : 'rejected';

      sheet.getRange(i + 1, statusIndex + 1).setValue(status);
    }
  }
}

function updateCustomerStatus(
  customerId,
  status
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Customers');

  const rows =
    sheet.getDataRange().getValues();

  const headers = rows[0];

  const customerIdIndex =
    headers.indexOf('customer_id');

  const statusIndex =
    headers.indexOf('status');

  for (let i = 1; i < rows.length; i++) {

    if (
      String(rows[i][customerIdIndex]) ===
      String(customerId)
    ) {

      sheet
        .getRange(
          i + 1,
          statusIndex + 1
        )
        .setValue(status);

      return;
    }
  }
}

function createRequestOptions(requestId, session) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('RequestOptions');

  const headers = sheet.getDataRange().getValues()[0];
  const now = new Date();

  for (let i = 1; i <= 3; i++) {
    const date = session['option' + i + '_date'];
    const time = session['option' + i + '_time'];

    if (date && time) {
      const newRow = new Array(headers.length).fill('');

      newRow[headers.indexOf('option_id')] = generateId('opt');
      newRow[headers.indexOf('request_id')] = requestId;
      newRow[headers.indexOf('preferred_date')] = date;
      newRow[headers.indexOf('preferred_time')] = time;
      newRow[headers.indexOf('priority')] = i;
      newRow[headers.indexOf('status')] = 'pending';

      if (headers.indexOf('created_at') !== -1) {
        newRow[headers.indexOf('created_at')] = now;
      }

      sheet.appendRow(newRow);
    }
  }
}

function isRequestAlreadyProcessed(requestId) {
  const request = getRequestById(requestId);

  if (!request) {
    return true;
  }

  return request.status !== 'pending';
}
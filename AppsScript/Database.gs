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
  const updatedAtIndex = headers.indexOf('updated_at');

  if (fieldIndex === -1) {
    throw new Error('Field not found in UserSessions: ' + fieldName);
  }

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][telegramIndex]) === String(telegramId)) {
      sheet.getRange(i + 1, fieldIndex + 1).setValue(String(value));

      if (updatedAtIndex !== -1) {
        sheet.getRange(i + 1, updatedAtIndex + 1).setValue(new Date());
      }

      return;
    }
  }

  const newRow = new Array(headers.length).fill('');

  newRow[telegramIndex] = String(telegramId);
  newRow[fieldIndex] = String(value);

  if (updatedAtIndex !== -1) {
    newRow[updatedAtIndex] = new Date();
  }

  sheet.appendRow(newRow);
}

function getLocations() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Locations');

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0];
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    if (String(item.active).toUpperCase() !== 'TRUE') {
      continue;
    }

    result.push({
      id: item.location_id,
      name_key: item.name_key,
      address_key: item.address_key,
      name: getMessage(item.name_key),
      address: getMessage(item.address_key),
      working_hours: item.working_hours,
      instagram: item.instagram,
      telegram: item.telegram,
      website: item.website,
      google_maps_url: item.google_maps_url,
      phone_1: item.phone_1,
      phone_2: item.phone_2,
      active: item.active
    });
  }

  return result;
}

function findLocationByName(locationName) {
  const locations = getLocations();
  const targetName = String(locationName).trim();

  for (let i = 0; i < locations.length; i++) {
    if (String(locations[i].name).trim() === targetName) {
      return locations[i];
    }
  }

  return null;
}

function getServices() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Services');

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0];
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[String(header).trim()] = rows[i][index];
    });

    if (String(item.active).toUpperCase() !== 'TRUE') {
      continue;
    }

    const nameKey =
      String(item.name_key || '').trim();

    const serviceName =
      nameKey
        ? getMessage(nameKey)
        : '';

    result.push({
      id: item.service_id,
      service_id: item.service_id,
      name_key: nameKey,
      name:
        serviceName ||
        nameKey ||
        item.service_id,
      default_duration_minutes:
        item.default_duration_minutes,
      base_price: item.base_price,
      active: item.active
    });
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
  const services = getServices();
  const targetName = String(serviceName).trim();

  for (let i = 0; i < services.length; i++) {
    if (String(services[i].name).trim() === targetName) {
      return services[i];
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

function getProviders() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Providers');

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0];
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[String(header).trim()] = rows[i][index];
    });

    if (String(item.active).toUpperCase() !== 'TRUE') {
      continue;
    }

    const nameKey =
      String(item.name_key || '').trim();

    const providerName =
      nameKey
        ? getMessage(nameKey)
        : '';

    addAuditLog(
      'PROVIDER_NAME_DEBUG',
      JSON.stringify({
        provider_id: item.provider_id,
        raw_name_key: item.name_key,
        name_key: nameKey,
        message: getMessage(nameKey)
      })
    );

    result.push({
      id: item.provider_id,
      provider_id: item.provider_id,
      location_id: item.location_id,
      name_key: nameKey,
      name:
        providerName ||
        nameKey ||
        item.provider_id,
      phone: item.phone,
      telegram_id: item.telegram_id,
      calendar_id: item.calendar_id,
      active: item.active
    });
  }

  addAuditLog(
    'GET_PROVIDERS_RESULT',
    JSON.stringify(result)
  );

  return result;
}

function findProviderByName(providerName) {
  const providers = getProviders();
  const targetName = String(providerName).trim();

  for (let i = 0; i < providers.length; i++) {
    if (String(providers[i].name).trim() === targetName) {
      return providers[i];
    }
  }

  return null;
}

function getProvidersByLocation(locationId) {
  const providers = getProviders();
  const result = [];

  providers.forEach(function(provider) {
    if (String(provider.location_id) === String(locationId)) {
      result.push(provider);
    }
  });

  return result;
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
  const statusIndex = headers.indexOf('status');
  const notesIndex = headers.indexOf('notes');

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
    const rowPhone = String(rows[i][phoneIndex] || '').trim();

    if (rowPhone === phone) {
      sheet.getRange(i + 1, nameIndex + 1).setValue(name);
      sheet.getRange(i + 1, telegramIdIndex + 1).setValue(telegramId);
      sheet.getRange(i + 1, phoneIndex + 1).setNumberFormat('@');
      sheet.getRange(i + 1, phoneIndex + 1).setValue(phone);
      sheet.getRange(i + 1, languageIndex + 1).setValue(language);
      sheet.getRange(i + 1, updatedAtIndex + 1).setValue(now);

      return rows[i][customerIdIndex];
    }
  }

  const customerId = generateId('cust');

  const newRow = new Array(headers.length).fill('');

  newRow[customerIdIndex] = customerId;
  newRow[telegramIdIndex] = telegramId;
  newRow[nameIndex] = name;
  newRow[phoneIndex] = phone;
  newRow[languageIndex] = language;
  newRow[createdAtIndex] = now;
  newRow[updatedAtIndex] = now;
  newRow[lastVisitAtIndex] = '';
  newRow[statusIndex] = 'lead';
  newRow[notesIndex] = '';

  sheet.appendRow(newRow);

  const rowIndex = sheet.getLastRow();
  sheet.getRange(rowIndex, phoneIndex + 1).setNumberFormat('@');
  sheet.getRange(rowIndex, phoneIndex + 1).setValue(phone);

  return customerId;
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
  if (headers.indexOf('customer_note') !== -1) {
    newRow[headers.indexOf('customer_note')] =
      session.customer_note || '';
  }
  sheet.appendRow(newRow);

  return requestId;
}

function finalizeRequestFromSession(session) {
  addAuditLog('FINALIZE_START', JSON.stringify(session));

  const customerId = createOrUpdateCustomer(session);
  addAuditLog('FINALIZE_CUSTOMER_CREATED', customerId);

  const requestId = createRequest(customerId, session);
  addAuditLog('FINALIZE_REQUEST_CREATED', requestId);

  createRequestOptions(requestId, session);
  addAuditLog('FINALIZE_OPTIONS_CREATED', requestId);

  return requestId;
}

function findLocationById(locationId) {
  const locations = getLocations();

  for (let i = 0; i < locations.length; i++) {
    if (String(locations[i].id) === String(locationId)) {
      return locations[i];
    }
  }

  return null;
}

function findServiceById(serviceId) {
  const services = getServices();

  for (let i = 0; i < services.length; i++) {
    if (String(services[i].id) === String(serviceId)) {
      return services[i];
    }
  }

  return null;
}

function findProviderById(providerId) {
  const providers = getProviders();

  for (let i = 0; i < providers.length; i++) {
    if (String(providers[i].id) === String(providerId)) {
      return providers[i];
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

  const durationMinutes = getServiceDurationMinutes(
    request.customer_id,
    request.service_id,
    request.provider_id
  );

  const endAt = addMinutesToDateTime(
    startAt,
    durationMinutes
  );

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
  if (headers.indexOf('customer_note') !== -1) {
    newRow[headers.indexOf('customer_note')] =
      request.customer_note || '';
  }
  sheet.appendRow(newRow);

  return appointmentId;
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

function getServiceDurationMinutes(
  customerId,
  serviceId,
  providerId
) {
  const settingsSheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerServiceSettings');

  const settingsRows =
    settingsSheet.getDataRange().getValues();

  const settingsHeaders = settingsRows[0];

  const customerIdIndex =
    settingsHeaders.indexOf('customer_id');

  const serviceIdIndex =
    settingsHeaders.indexOf('service_id');

  const providerIdIndex =
    settingsHeaders.indexOf('provider_id');

  const durationIndex =
    settingsHeaders.indexOf('duration_minutes');

  for (let i = 1; i < settingsRows.length; i++) {

    if (
      String(settingsRows[i][customerIdIndex]) === String(customerId) &&
      String(settingsRows[i][serviceIdIndex]) === String(serviceId) &&
      String(settingsRows[i][providerIdIndex]) === String(providerId)
    ) {

      const duration =
        Number(settingsRows[i][durationIndex]);

      if (duration > 0) {
        return duration;
      }
    }
  }

  return getDefaultServiceDurationMinutes(
    serviceId
  );
}

function getDefaultServiceDurationMinutes(serviceId) {
  const service = findServiceById(serviceId);

  if (!service) {
    return 60;
  }

  return Number(
    service.default_duration_minutes || 60
  );
}

function getProviderScheduleForDate(providerId, dateValue) {
  const normalizedDate = normalizeDateForStorage(dateValue);

  const override =
    getProviderScheduleOverrideForDate(providerId, normalizedDate);

  if (override) {
    return override;
  }

  const dayOfWeek =
    getDayOfWeekCode(normalizedDate);

  return getProviderWeeklySchedule(
    providerId,
    dayOfWeek
  );
}

function getProviderScheduleOverrideForDate(providerId, normalizedDate) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('ProviderScheduleOverrides');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const providerIdIndex = headers.indexOf('provider_id');
  const dateIndex = headers.indexOf('date');
  const startIndex = headers.indexOf('start_time');
  const endIndex = headers.indexOf('end_time');
  const workingIndex = headers.indexOf('is_working');

  for (let i = 1; i < rows.length; i++) {
    const rowDate = normalizeDateForStorage(rows[i][dateIndex]);

    if (
      String(rows[i][providerIdIndex]) === String(providerId) &&
      rowDate === normalizedDate
    ) {
      return {
        isWorking: String(rows[i][workingIndex]).toUpperCase() === 'TRUE',
        startTime: normalizeTimeForStorage(rows[i][startIndex]),
        endTime: normalizeTimeForStorage(rows[i][endIndex])
      };
    }
  }

  return null;
}

function getProviderWeeklySchedule(providerId, dayOfWeek) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('ProviderSchedule');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const providerIdIndex = headers.indexOf('provider_id');
  const dayIndex = headers.indexOf('day_of_week');
  const startIndex = headers.indexOf('start_time');
  const endIndex = headers.indexOf('end_time');
  const workingIndex = headers.indexOf('is_working');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][providerIdIndex]) === String(providerId) &&
      String(rows[i][dayIndex]).toUpperCase() === dayOfWeek
    ) {
      return {
        isWorking: String(rows[i][workingIndex]).toUpperCase() === 'TRUE',
        startTime: normalizeTimeForStorage(rows[i][startIndex]),
        endTime: normalizeTimeForStorage(rows[i][endIndex])
      };
    }
  }

  return {
    isWorking: false,
    startTime: '',
    endTime: ''
  };
}

function getAvailableTimeSlots(
  providerId,
  dateValue,
  durationMinutes,
  customerId
) {
  const schedule = getProviderScheduleForDate(providerId, dateValue);

  if (!schedule || !schedule.isWorking) {
    return [];
  }

  if (!schedule.startTime || !schedule.endTime) {
    return [];
  }

  let startMinutes = timeToMinutes(schedule.startTime);
  const endMinutes = timeToMinutes(schedule.endTime);

  if (isSameDate(dateValue, new Date())) {
    const bufferMinutes = 30;
    const stepMinutes = 30;

    const earliestMinutes =
      getCurrentTimeMinutes() + bufferMinutes;

    const roundedEarliestMinutes =
      roundMinutesUpToStep(
        earliestMinutes,
        stepMinutes
      );

    if (roundedEarliestMinutes > startMinutes) {
      startMinutes = roundedEarliestMinutes;
    }
  }

  const providerAppointments =
    getProviderAppointmentsForDate(
      providerId,
      dateValue
    );

  const conflictCustomerIds =
    customerId
      ? getConflictingCustomerIds(customerId)
      : [];

  const conflictAppointments =
    getAppointmentsForCustomersOnDate(
      conflictCustomerIds,
      dateValue
    );

  const allBlockingAppointments =
    providerAppointments.concat(
      conflictAppointments
    );

  addAuditLog(
    'AVAILABLE_SLOT_BLOCKERS',
    JSON.stringify({
      providerId: providerId,
      customerId: customerId || '',
      date: dateValue,
      providerAppointments: providerAppointments,
      conflictCustomerIds: conflictCustomerIds,
      conflictAppointments: conflictAppointments
    })
  );

  const busyIntervals = allBlockingAppointments
    .filter(function(item) {
      return item.startTime && item.endTime;
    })
    .map(function(item) {
      return {
        start: timeToMinutes(item.startTime),
        end: timeToMinutes(item.endTime)
      };
    });

  const stepMinutes = 30;
  const result = [];

  addAuditLog(
    'SLOTS_DEBUG_FULL',
    JSON.stringify({
      providerId: providerId,
      customerId: customerId || '',
      dateValue: dateValue,
      durationMinutes: durationMinutes,
      schedule: schedule,
      startMinutes: startMinutes,
      endMinutes: endMinutes,
      busyIntervals: busyIntervals
    })
  );

  for (
    let current = startMinutes;
    current + Number(durationMinutes) <= endMinutes;
    current += stepMinutes
  ) {
    const slotStart = current;
    const slotEnd =
      current + Number(durationMinutes);

    const hasConflict =
      busyIntervals.some(function(interval) {
        return (
          slotStart < interval.end &&
          slotEnd > interval.start
        );
      });

    if (!hasConflict) {
      result.push(
        minutesToTime(current)
      );
    }
  }

  return result;
}

function getProviderAppointmentsForDate(providerId, dateValue) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const appointmentIdIndex =
    headers.indexOf('appointment_id');

  const providerIdIndex =
    headers.indexOf('provider_id');

  const startAtIndex =
    headers.indexOf('start_at');

  const endAtIndex =
    headers.indexOf('end_at');

  const statusIndex =
    headers.indexOf('status');

  const calendarEventIdIndex =
    headers.indexOf('calendar_event_id');

  const targetDate =
    normalizeDateForStorage(dateValue);

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const appointmentId =
      rows[i][appointmentIdIndex];

    const provider =
      rows[i][providerIdIndex];

    const status =
      String(rows[i][statusIndex])
        .toLowerCase();

    if (String(provider) !== String(providerId)) {
      continue;
    }

    if (status !== 'confirmed') {
      continue;
    }

    const startAt =
      rows[i][startAtIndex];

    const endAt =
      rows[i][endAtIndex];

    const appointmentDate =
      normalizeDateForStorage(startAt);

    if (appointmentDate !== targetDate) {
      continue;
    }

    const calendarEventId =
      calendarEventIdIndex >= 0
        ? rows[i][calendarEventIdIndex]
        : '';

    if (calendarEventId) {
      const calendarEvent =
        getCalendarEventById(calendarEventId);

      if (!calendarEvent) {
        updateAppointmentStatus(
          appointmentId,
          'cancelled'
        );

        addAuditLog(
          'APPOINTMENT_AUTO_CANCELLED_MISSING_CALENDAR_EVENT',
          JSON.stringify({
            appointment_id: appointmentId,
            provider_id: providerId,
            calendar_event_id: calendarEventId
          })
        );

        continue;
      }
    }

    result.push({
      appointment_id: appointmentId,
      startTime: extractTimeFromDateTime(startAt),
      endTime: extractTimeFromDateTime(endAt)
    });
  }

  return result;
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
      sheet
        .getRange(i + 1, statusIndex + 1)
        .setValue(status);

      return;
    }
  }
}

function appointmentExistsForRequest(requestId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const requestIdIndex = headers.indexOf('request_id');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][requestIdIndex]) === String(requestId)) {
      return true;
    }
  }

  return false;
}

function getProviderCalendarId(providerId) {
  const provider =
    findProviderById(providerId);

  if (
    provider &&
    provider.calendar_id
  ) {
    return provider.calendar_id;
  }

  const settings =
    getSettings();

  return settings.DefaultCalendarId || '';
}

function updateAppointmentCalendarEventId(appointmentId, calendarEventId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const appointmentIdIndex = headers.indexOf('appointment_id');
  const calendarEventIdIndex = headers.indexOf('calendar_event_id');
  const updatedAtIndex = headers.indexOf('updated_at');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][appointmentIdIndex]) === String(appointmentId)) {
      sheet
        .getRange(i + 1, calendarEventIdIndex + 1)
        .setValue(calendarEventId);

      if (updatedAtIndex !== -1) {
        sheet
          .getRange(i + 1, updatedAtIndex + 1)
          .setValue(new Date());
      }

      return;
    }
  }
}

function getActiveAppointmentsByPhone(phone) {
  const searchPhone = getPhoneSearchKey(phone);

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Customers');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const customerIdIndex = headers.indexOf('customer_id');
  const phoneIndex = headers.indexOf('phone');

  const customerIds = [];

  for (let i = 1; i < rows.length; i++) {
    const rowPhone = getPhoneSearchKey(rows[i][phoneIndex]);

    if (
      rowPhone === searchPhone ||
      rowPhone.endsWith(searchPhone) ||
      searchPhone.endsWith(rowPhone)
    ) {
      customerIds.push(rows[i][customerIdIndex]);
    }
  }

  if (customerIds.length === 0) {
    return [];
  }

  return getAppointmentsByCustomerIds(customerIds);
}

function getAppointmentsByCustomerIds(customerIds) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const customerIdIndex = headers.indexOf('customer_id');
  const statusIndex = headers.indexOf('status');

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const customerId = rows[i][customerIdIndex];
    const status = String(rows[i][statusIndex]).toLowerCase();

    if (
      customerIds.indexOf(customerId) !== -1 &&
      status === 'confirmed'
    ) {
      const item = {};

      headers.forEach((header, index) => {
        item[header] = rows[i][index];
      });

      result.push(item);
    }
  }

  return result;
}

function getActiveAppointmentsByPhone(phone) {
  const searchPhoneKey = getPhoneSearchKey(phone);

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Customers');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const customerIdIndex = headers.indexOf('customer_id');
  const phoneIndex = headers.indexOf('phone');

  const customerIds = [];

  for (let i = 1; i < rows.length; i++) {
    const rowPhoneKey = getPhoneSearchKey(rows[i][phoneIndex]);

    if (rowPhoneKey === searchPhoneKey) {
      customerIds.push(rows[i][customerIdIndex]);
    }
  }

  return getAppointmentsByCustomerIds(customerIds);
}

function updateAppointmentStatus(appointmentId, status) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const appointmentIdIndex = headers.indexOf('appointment_id');
  const statusIndex = headers.indexOf('status');
  const updatedAtIndex = headers.indexOf('updated_at');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][appointmentIdIndex]) === String(appointmentId)) {
      sheet
        .getRange(i + 1, statusIndex + 1)
        .setValue(status);

      if (updatedAtIndex !== -1) {
        sheet
          .getRange(i + 1, updatedAtIndex + 1)
          .setValue(new Date());
      }

      return;
    }
  }
}

function getAppointmentById(appointmentId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const appointmentIdIndex = headers.indexOf('appointment_id');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][appointmentIdIndex]) === String(appointmentId)) {
      const result = {};

      headers.forEach(function(header, index) {
        result[header] = rows[i][index];
      });

      return result;
    }
  }

  return null;
}

function updateAppointmentDateTime(
  appointmentId,
  startAt,
  endAt
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const appointmentIdIndex =
    headers.indexOf('appointment_id');

  const startAtIndex =
    headers.indexOf('start_at');

  const endAtIndex =
    headers.indexOf('end_at');

  const updatedAtIndex =
    headers.indexOf('updated_at');

  const reminder24hIndex =
    headers.indexOf('reminder_24h_sent_at');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][appointmentIdIndex]) ===
      String(appointmentId)
    ) {
      sheet
        .getRange(i + 1, startAtIndex + 1)
        .setValue(startAt);

      sheet
        .getRange(i + 1, endAtIndex + 1)
        .setValue(endAt);

      if (reminder24hIndex !== -1) {
        sheet
          .getRange(i + 1, reminder24hIndex + 1)
          .setValue('');
      }

      if (updatedAtIndex !== -1) {
        sheet
          .getRange(i + 1, updatedAtIndex + 1)
          .setValue(new Date());
      }

      return;
    }
  }
}

function getAllAppointmentCalendarEventIds() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const calendarEventIdIndex = headers.indexOf('calendar_event_id');

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const calendarEventId = String(rows[i][calendarEventIdIndex] || '').trim();

    if (calendarEventId) {
      result.push(calendarEventId);
    }
  }

  return result;
}

function getAppointmentsFor24hReminder() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const statusIndex = headers.indexOf('status');
  const reminderIndex = headers.indexOf('reminder_24h_sent_at');

  const timezone = getSettings().TimeZone || 'Europe/Kyiv';

  const now = new Date();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowString = Utilities.formatDate(
    tomorrow,
    timezone,
    'yyyy-MM-dd'
  );

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const status = String(rows[i][statusIndex] || '').toLowerCase();
    const reminderSentAt = rows[i][reminderIndex];

    if (status !== 'confirmed') {
      continue;
    }

    if (reminderSentAt) {
      continue;
    }

    let appointment = {};

    headers.forEach(function(header, index) {
      appointment[header] = rows[i][index];
    });

    appointment = syncAppointmentWithCalendar(
      appointment,
      true
    );

    const appointmentDateString =
      normalizeDateForStorage(
        appointment.start_at
      );

    if (appointmentDateString !== tomorrowString) {
      continue;
    }

    result.push(appointment);
  }

  return result;
}

function updateAppointmentField(appointmentId, fieldName, value) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const appointmentIdIndex = headers.indexOf('appointment_id');
  const fieldIndex = headers.indexOf(fieldName);
  const updatedAtIndex = headers.indexOf('updated_at');

  if (fieldIndex === -1) {
    throw new Error('Appointments field not found: ' + fieldName);
  }

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][appointmentIdIndex]) === String(appointmentId)) {
      sheet
        .getRange(i + 1, fieldIndex + 1)
        .setValue(value);

      if (updatedAtIndex !== -1) {
        sheet
          .getRange(i + 1, updatedAtIndex + 1)
          .setValue(new Date());
      }

      return;
    }
  }
}

function getCustomerByPhone(phone) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Customers');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const phoneIndex = headers.indexOf('phone');

  const searchKey = getPhoneSearchKey(phone);

  for (let i = 1; i < rows.length; i++) {
    const rowPhone = rows[i][phoneIndex];

    if (getPhoneSearchKey(rowPhone) === searchKey) {
      const result = {};

      headers.forEach(function(header, index) {
        result[header] = rows[i][index];
      });

      return result;
    }
  }

  return null;
}

function getCustomerServiceDurationMinutes(
  customerId,
  serviceId,
  providerId
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerServiceSettings');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const customerIdIndex = headers.indexOf('customer_id');
  const serviceIdIndex = headers.indexOf('service_id');
  const providerIdIndex = headers.indexOf('provider_id');
  const durationIndex = headers.indexOf('duration_minutes');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][customerIdIndex]) === String(customerId) &&
      String(rows[i][serviceIdIndex]) === String(serviceId) &&
      String(rows[i][providerIdIndex]) === String(providerId)
    ) {
      const duration = Number(rows[i][durationIndex]);

      if (duration > 0) {
        return duration;
      }
    }
  }

  return null;
}

function getServiceDurationMinutesForSession(session) {
  if (
    session.customer_id &&
    session.service_id &&
    session.provider_id
  ) {
    const individualDuration =
      getCustomerServiceDurationMinutes(
        session.customer_id,
        session.service_id,
        session.provider_id
      );

    if (individualDuration) {
      return individualDuration;
    }
  }

  return getDefaultServiceDurationMinutes(
    session.service_id
  );
}

function getConflictingCustomerIds(customerId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerConflicts');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const customerIdIndex =
    headers.indexOf('customer_id');

  const conflictCustomerIdIndex =
    headers.indexOf('conflict_customer_id');

  const activeIndex =
    headers.indexOf('active');

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const active =
      String(rows[i][activeIndex])
        .toUpperCase();

    if (active !== 'TRUE') {
      continue;
    }

    if (
      String(rows[i][customerIdIndex]) ===
      String(customerId)
    ) {
      result.push(
        rows[i][conflictCustomerIdIndex]
      );
    }
  }

  return result;
}

function getAppointmentsForCustomersOnDate(
  customerIds,
  dateValue
) {
  if (!customerIds || customerIds.length === 0) {
    return [];
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const customerIdIndex =
    headers.indexOf('customer_id');

  const startAtIndex =
    headers.indexOf('start_at');

  const endAtIndex =
    headers.indexOf('end_at');

  const statusIndex =
    headers.indexOf('status');

  const targetDate =
    normalizeDateForStorage(dateValue);

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const customerId =
      String(rows[i][customerIdIndex]);

    const status =
      String(rows[i][statusIndex])
        .toLowerCase();

    if (status !== 'confirmed') {
      continue;
    }

    if (
      customerIds.indexOf(customerId) === -1
    ) {
      continue;
    }

    const startAt = rows[i][startAtIndex];
    const endAt = rows[i][endAtIndex];

    const appointmentDate =
      normalizeDateForStorage(startAt);

    if (appointmentDate !== targetDate) {
      continue;
    }

    result.push({
      customer_id: customerId,
      startTime:
        extractTimeFromDateTime(startAt),
      endTime:
        extractTimeFromDateTime(endAt)
    });
  }

  return result;
}

function getActiveRequestRecipients() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('RequestRecipients');

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0];

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    const active =
      String(item.active).toUpperCase();

    const receiveRequests =
      String(item.receive_new_requests)
        .toUpperCase();

    if (
      active === 'TRUE' &&
      receiveRequests === 'TRUE' &&
      item.telegram_id
    ) {
      result.push(item);
    }
  }

  return result;
}

function getLocalizedProviderName(provider) {
  const settings = getSettings();
  const lang = settings.Language || 'ru';

  const key = 'name_' + lang;

  return String(
    provider[key] ||
    provider.name_ru ||
    provider.name_uk ||
    provider.name_en ||
    ''
  ).trim();
}

function createProviderFromAdminSession(session) {
  const providerName =
    String(session.provider_name || '').trim();

  const locationId =
    String(session.provider_location_id || '').trim();

  const phone =
    String(session.provider_phone || '').trim();

  const telegramId =
    String(session.provider_telegram_id || '').trim();

  return createProvider({
    name: providerName,
    location_id: locationId,
    phone: phone,
    telegram_id: telegramId,
    calendar_id: ''
  });
}

function createProvider(providerData) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Providers');

  const providerId =
    generateProviderId();

  const nameKey =
    generateProviderNameKey(providerId);

  createOrUpdateMessageValues(
    nameKey,
    createMessageValuesForAllLanguages(
      providerData.name
    )
  );

  sheet.appendRow([
    providerId,
    providerData.location_id,
    nameKey,
    providerData.phone,
    providerData.telegram_id,
    providerData.calendar_id || '',
    true
  ]);

  return providerId;
}

function generateProviderId() {
  return 'prov_' + new Date().getTime();
}

function generateProviderNameKey(providerId) {
  return (
    'PROVIDER_NAME_' +
    String(providerId).replace('prov_', '')
  );
}

function createOrUpdateMessageValues(messageKey, valuesByLang) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Messages');

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
    .getSheetByName('Messages');

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


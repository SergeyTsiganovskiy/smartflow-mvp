// =========================
// APPOINTMENTS: READ
// =========================

function getAppointmentById(appointmentId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

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

function getAppointmentsByCustomerIds(customerIds) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

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

function isCurrentOrFutureAppointment(appointment) {
  const endValue =
    appointment.end_at ||
    appointment.endAt ||
    appointment.endTime;

  if (!endValue) {
    return true;
  }

  const endDate =
    parseDateTimeForCalendar(endValue);

  return endDate.getTime() >= new Date().getTime();
}

function createAppointmentFromRequest(request, option) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

  const headers = sheet.getDataRange().getValues()[0];

  const now = new Date();

  const appointmentId = generateId('appt');

  const startAt = buildDateTime(
    option.preferred_date,
    option.preferred_time
  );

  const customer =
    getCustomerById(
      request.customer_id
    );

  const durationMinutes =
    getServiceDurationMinutesForSession({
      customer_phone:
        customer ? customer.phone : '',

      service_id:
        request.service_id
    });

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

function getProviderAppointmentsForDate(providerId, dateValue) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return getManualCalendarBusySlotsForProvider(
      providerId,
      dateValue
    );
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const providerIdIndex = headers.indexOf('provider_id');
  const startAtIndex = headers.indexOf('start_at');
  const statusIndex = headers.indexOf('status');

  const targetDate =
    normalizeDateForStorage(dateValue);

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const provider =
      rows[i][providerIdIndex];

    const status =
      String(rows[i][statusIndex] || '').toLowerCase();

    if (String(provider) !== String(providerId)) {
      continue;
    }

    if (status !== 'confirmed') {
      continue;
    }

    const startAt =
      rows[i][startAtIndex];

    const appointmentDate =
      normalizeDateForStorage(startAt);

    if (appointmentDate !== targetDate) {
      continue;
    }

    const appointment = {};

    headers.forEach(function(header, index) {
      appointment[header] = rows[i][index];
    });

    if (!isAppointmentStillValid(appointment)) {
      continue;
    }

    result.push({
      appointment_id: appointment.appointment_id,
      startTime: extractTimeFromDateTime(appointment.start_at),
      endTime: extractTimeFromDateTime(appointment.end_at)
    });
  }

  const manualCalendarSlots =
    getManualCalendarBusySlotsForProvider(
      providerId,
      dateValue
    );

  manualCalendarSlots.forEach(function(slot) {
    result.push(slot);
  });

  return result;
}

function appointmentExistsForRequest(requestId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

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

function updateAppointmentCalendarEventId(appointmentId, calendarEventId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

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

function updateAppointmentStatus(appointmentId, status) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

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

function getAllAppointmentCalendarEventIds() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

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
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

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
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

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

function updateAppointmentDateTime(
  appointmentId,
  startAt,
  endAt
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

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

// =========================
// APPOINTMENTS: ADMIN LISTS
// =========================

function getTodayAppointments() {
  const settings = getSettings();
  const timezone = settings.TimeZone || 'Europe/Kyiv';

  const today = Utilities.formatDate(
    new Date(),
    timezone,
    'yyyy-MM-dd'
  );

  return getAppointmentsByDate(today);
}

function getAppointmentsByDate(dateValue) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

  const rows = sheet.getDataRange().getValues();
  const result = [];

  const targetDate =
    normalizeDateForStorage(dateValue);

  // =========================
  // Appointments sheet records
  // =========================

  if (rows.length >= 2) {
    const headers = rows[0].map(function(header) {
      return String(header).trim();
    });

    const startAtIndex = headers.indexOf('start_at');
    const statusIndex = headers.indexOf('status');

    for (let i = 1; i < rows.length; i++) {
      const status =
        String(rows[i][statusIndex] || '').toLowerCase();

      if (status !== 'confirmed') {
        continue;
      }

      const appointmentDate =
        normalizeDateForStorage(rows[i][startAtIndex]);

      if (appointmentDate !== targetDate) {
        continue;
      }

      const appointment = {};

      headers.forEach(function(header, index) {
        appointment[header] = rows[i][index];
      });

      if (!isAppointmentStillValid(appointment)) {
        continue;
      }

      result.push(appointment);
    }
  }

  // =========================
  // Manual Google Calendar records
  // =========================

  const manualAppointments =
    getManualCalendarAppointmentsByDateOptimized(dateValue);

  manualAppointments.forEach(function(appointment) {
    result.push(appointment);
  });

  // =========================
  // Sort and return
  // =========================

  result.sort(function(a, b) {
    return new Date(a.start_at) - new Date(b.start_at);
  });

  return result;
}

// =========================
// APPOINTMENTS: CALENDAR SYNC
// =========================

function isAppointmentStillValid(appointment) {
  const calendarEventId =
    String(appointment.calendar_event_id || '').trim();

  if (!calendarEventId) {
    return true;
  }

  const calendarEvent =
    getCalendarEventByAppointment(appointment);

  if (calendarEvent) {
    return true;
  }

  updateAppointmentStatus(
    appointment.appointment_id,
    'cancelled'
  );

  return false;
}

function getManualCalendarAppointmentsByDate(dateValue) {
  const providers = getProviders();
  const result = [];

  providers.forEach(function(provider) {
    const providerId =
      provider.id ||
      provider.provider_id;

    if (!providerId) {
      return;
    }

    const manualSlots =
      getManualCalendarBusySlotsForProvider(
        providerId,
        dateValue
      );

    manualSlots.forEach(function(slot) {
      result.push({
        source: slot.source || 'calendar_manual',

        appointment_id: slot.appointment_id || '',
        request_id: slot.request_id || '',

        customer_id: slot.customer_id || '',
        customer_name: slot.customer_name || '',
        phone: slot.phone || '',

        service_id: slot.service_id || '',
        service_name: slot.service_name || '',

        provider_id: slot.provider_id || providerId,
        provider_name: slot.provider_name || provider.name || '',

        location_id: slot.location_id || provider.location_id || '',

        start_at: slot.start_at,
        end_at: slot.end_at,
        startTime: slot.startTime || '',
        endTime: slot.endTime || '',

        status: slot.status || 'confirmed',
        calendar_event_id: slot.calendar_event_id || '',

        title: slot.title || '',
        description: slot.description || ''
      });
    });
  });

  return result;
}

function confirmAppointmentByCustomer(
  appointmentId
) {
  updateAppointmentField(
    appointmentId,
    'customer_confirmed',
    true
  );

  updateAppointmentField(
    appointmentId,
    'customer_confirmed_at',
    new Date()
  );
}

function processAppointmentConfirmation(
  callbackQuery
) {
  const data =
    callbackQuery.data || '';

  const appointmentId =
    data.split(':')[1];

  if (!appointmentId) {
    return;
  }

  const appointment =
    getAppointmentById(
      appointmentId
    );

  if (!appointment) {
    answerCallbackQuery(
      callbackQuery.id,
      getMessage(
        MESSAGE_KEYS.APPOINTMENT_NOT_FOUND
      )
    );

    return;
  }

  if (
    String(
      appointment.customer_confirmed || ''
    ).toUpperCase() === 'TRUE'
  ) {
    answerCallbackQuery(
      callbackQuery.id,
      getMessage(
        MESSAGE_KEYS.APPOINTMENT_ALREADY_CONFIRMED
      )
    );

    return;
  }

  confirmAppointmentByCustomer(
    appointmentId
  );

  notifyAdminsAboutCustomerConfirmation(
    appointment
  );

  const settings =
  getSettings();

  editTelegramMessageReplyMarkup(
    settings.ClientBotToken,
    callbackQuery.message.chat.id,
    callbackQuery.message.message_id,
    {}
  );

  answerCallbackQuery(
    callbackQuery.id,
    getMessage(
      MESSAGE_KEYS.APPOINTMENT_CONFIRMED_BY_CUSTOMER
    )
  );

  sendTelegramMessage(
    settings.ClientBotToken,
    callbackQuery.message.chat.id,
    getMessage(
      MESSAGE_KEYS.APPOINTMENT_CONFIRMED_BY_CUSTOMER
    )
  );
}

function getCustomerConfirmationText(appointment) {
  const confirmed =
    String(appointment.customer_confirmed || '').toUpperCase() === 'TRUE' ||
    appointment.customer_confirmed === true;

  return confirmed
    ? getMessage(MESSAGE_KEYS.APPOINTMENT_CONFIRMED_BY_CUSTOMER)
    : '⏳ ' + getMessage(MESSAGE_KEYS.APPOINTMENT_NOT_CONFIRMED_BY_CUSTOMER);
}
function getActiveAppointmentsByPhone(phone) {
  const searchPhoneKey = getPhoneSearchKey(phone);

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CUSTOMERS);

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

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
    request.service_id
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
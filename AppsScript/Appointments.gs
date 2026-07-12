// =========================
// APPOINTMENTS: READ
// =========================




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

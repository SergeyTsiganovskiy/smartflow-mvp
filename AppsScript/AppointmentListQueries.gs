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

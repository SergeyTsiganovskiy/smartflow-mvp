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

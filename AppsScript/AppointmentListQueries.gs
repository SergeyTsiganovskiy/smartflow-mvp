function getAllAppointmentCalendarEventIds() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.APPOINTMENTS);

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

  const today = Utilities.formatDate(new Date(), timezone, 'yyyy-MM-dd');

  return getAppointmentsByDate(today);
}

function getAppointmentsByDate(dateValue) {
  return getAppointmentsByRange(dateValue, dateValue);
}

function getAppointmentsByRange(startDateValue, endDateValue, providerId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.APPOINTMENTS);

  const rows = sheet.getDataRange().getValues();
  const result = [];

  const startDate = normalizeDateForStorage(startDateValue);
  const endDate = normalizeDateForStorage(endDateValue);

  if (rows.length >= 2) {
    const headers = rows[0].map(function (header) {
      return String(header).trim();
    });

    const startAtIndex = headers.indexOf('start_at');
    const statusIndex = headers.indexOf('status');

    for (let i = 1; i < rows.length; i++) {
      const status = String(rows[i][statusIndex] || '').toLowerCase();

      if (status !== 'confirmed') {
        continue;
      }

      const appointmentDate = normalizeDateForStorage(rows[i][startAtIndex]);

      if (appointmentDate < startDate || appointmentDate > endDate) {
        continue;
      }

      const appointment = {};

      headers.forEach(function (header, index) {
        appointment[header] = rows[i][index];
      });

      if (providerId && String(appointment.provider_id) !== String(providerId)) {
        continue;
      }

      if (!isAppointmentStillValid(appointment)) {
        continue;
      }

      result.push(enrichAppointmentForDisplay(appointment));
    }
  }

  const manualAppointments = getManualCalendarAppointmentsByRange(startDate, endDate, providerId);

  manualAppointments.forEach(function (appointment) {
    result.push(appointment);
  });

  result.sort(function (a, b) {
    return new Date(a.start_at) - new Date(b.start_at);
  });

  return result;
}

function getAppointmentsByProvider(providerId) {
  const settings = getSettings();
  const timezone = settings.TimeZone || 'Europe/Kyiv';
  const bookingDays = Number(settings.BookingDaysAhead || 30);
  const now = new Date();
  const end = new Date(now);

  end.setDate(end.getDate() + bookingDays);

  const startDate = Utilities.formatDate(now, timezone, 'yyyy-MM-dd');
  const endDate = Utilities.formatDate(end, timezone, 'yyyy-MM-dd');

  return getAppointmentsByRange(startDate, endDate, providerId).filter(function (appointment) {
    return new Date(appointment.end_at) >= now;
  });
}

function enrichAppointmentForDisplay(appointment) {
  if (appointment.source === 'calendar_manual') {
    return appointment;
  }

  const customer = getCustomerById(appointment.customer_id);
  const service = findServiceById(appointment.service_id);
  const provider = findProviderById(appointment.provider_id);
  const location = findLocationById(appointment.location_id);

  appointment.source = appointment.source || 'appointment';
  appointment.customer_name = customer ? customer.name : '';
  appointment.phone = customer ? customer.phone : '';
  appointment.service_name = service ? service.name : '';
  appointment.provider_name = provider ? provider.name : '';
  appointment.location_name = location ? location.name : '';

  return appointment;
}

function getNextCustomerAppointment(phone) {
  const now = new Date();
  const appointments = getActiveAppointmentsByPhone(phone)
    .map(function (appointment) {
      return syncAppointmentWithCalendar(appointment);
    })
    .filter(function (appointment) {
      return appointment && isCurrentOrFutureAppointment(appointment);
    })
    .map(enrichAppointmentForDisplay);

  getCalendarAppointmentsByPhone(phone).forEach(function (appointment) {
    if (new Date(appointment.end_at) >= now) {
      appointments.push(appointment);
    }
  });

  appointments.sort(function (a, b) {
    return new Date(a.start_at) - new Date(b.start_at);
  });

  return appointments[0] || null;
}

function isAppointmentStillValid(appointment) {
  const calendarEventId = String(appointment.calendar_event_id || '').trim();

  if (!calendarEventId) {
    return true;
  }

  const calendarEvent = getCalendarEventByAppointment(appointment);

  if (calendarEvent) {
    return true;
  }

  updateAppointmentStatus(appointment.appointment_id, 'cancelled');

  return false;
}

function getActiveAppointmentsByPhone(phone) {
  const searchPhoneKey = getPhoneSearchKey(phone);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMERS);

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

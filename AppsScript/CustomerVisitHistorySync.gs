function syncCompletedCustomerVisitsTrigger() {
  const lock = LockService.getScriptLock();

  if (!lock.tryLock(30000)) {
    addAuditLog('CUSTOMER_VISIT_SYNC_LOCK_SKIP', 'Another sync is already running');
    return;
  }

  try {
    syncCompletedCustomerVisits();
    syncCustomerProfiles();
  } finally {
    lock.releaseLock();
  }
}

function syncCompletedCustomerVisits() {
  const now = new Date();
  const visits = getCompletedAppointmentVisits(now).concat(getRecentlyCompletedManualCalendarVisits(now));

  visits.forEach(upsertCustomerVisit);
}

function getCompletedAppointmentVisits(now) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.APPOINTMENTS);
  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const appointment = {};

    headers.forEach(function (header, index) {
      appointment[header] = rows[i][index];
    });

    if (String(appointment.status || '').toLowerCase() !== 'confirmed') {
      continue;
    }

    if (!appointment.calendar_event_id || !appointment.end_at || new Date(appointment.end_at) > now) {
      continue;
    }

    result.push(enrichAppointmentForDisplay(appointment));
  }

  return result;
}

function getRecentlyCompletedManualCalendarVisits(now) {
  const settings = getSettings();
  const timezone = settings.TimeZone || 'Europe/Kyiv';
  const start = new Date(now);

  start.setDate(start.getDate() - 7);

  const startDate = Utilities.formatDate(start, timezone, 'yyyy-MM-dd');
  const endDate = Utilities.formatDate(now, timezone, 'yyyy-MM-dd');

  return getManualCalendarAppointmentsByRange(startDate, endDate).filter(function (appointment) {
    return (
      appointment.calendar_event_id &&
      getPhoneSearchKey(appointment.phone) &&
      appointment.end_at &&
      new Date(appointment.end_at) <= now
    );
  });
}

function upsertCustomerVisit(item) {
  const existingVisit = findCustomerVisitByCalendarEventId(item.calendar_event_id);
  const values = {
    customer_name: item.customer_name || '',
    service_id: item.service_id || '',
    service_name: item.service_name || '',
    provider_id: item.provider_id || '',
    provider_name: item.provider_name || '',
    location_id: item.location_id || '',
    location_name: item.location_name || '',
    start_at: item.start_at || '',
    end_at: item.end_at || '',
    status: item.status || '',
    customer_note: item.customer_note || '',
    synced_at: new Date()
  };

  if (existingVisit) {
    if (hasCustomerVisitChanged(existingVisit, values)) {
      updateCustomerVisitHistory(existingVisit.visit_id, values);
    }
    return;
  }

  createCustomerVisitHistory({
    source: item.source || 'appointment',
    appointment_id: item.appointment_id || '',
    calendar_event_id: item.calendar_event_id,
    phone: item.phone || '',
    customer_name: values.customer_name,
    service_id: values.service_id,
    service_name: values.service_name,
    provider_id: values.provider_id,
    provider_name: values.provider_name,
    location_id: values.location_id,
    location_name: values.location_name,
    start_at: values.start_at,
    end_at: values.end_at,
    status: values.status,
    customer_note: values.customer_note
  });
}

function hasCustomerVisitChanged(existingVisit, values) {
  const fields = [
    'customer_name',
    'service_id',
    'service_name',
    'provider_id',
    'provider_name',
    'location_id',
    'location_name',
    'start_at',
    'end_at',
    'status',
    'customer_note'
  ];

  return fields.some(function (field) {
    if (field === 'start_at' || field === 'end_at') {
      return new Date(existingVisit[field]).getTime() !== new Date(values[field]).getTime();
    }

    return String(existingVisit[field] || '') !== String(values[field] || '');
  });
}

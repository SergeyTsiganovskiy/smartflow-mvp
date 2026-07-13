function buildCalendarCacheRow(record) {
  const now = new Date();

  return [
    record.cache_id || '',
    record.cache_date || '',

    record.source || '',

    record.appointment_id || '',
    record.calendar_event_id || '',

    record.customer_id || '',
    record.customer_name || '',
    record.phone || '',

    record.service_id || '',
    record.service_name || '',

    record.provider_id || '',
    record.provider_name || '',

    record.location_id || '',
    record.location_name || '',

    record.start_at || '',
    record.end_at || '',

    record.status || 'confirmed',

    record.title || '',
    record.description || '',
    record.customer_note || '',

    record.synced_at || now,
    record.created_at || now,
    record.updated_at || now,
    record.customer_confirmed || '',
    record.customer_confirmed_at || ''
  ];
}

function buildAppointmentCacheRows(dateValue) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.APPOINTMENTS);

  const rows = sheet.getDataRange().getValues();

  const result = [];

  if (rows.length < 2) {
    return result;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const targetDate = normalizeDateForStorage(dateValue);

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function (header, index) {
      item[header] = rows[i][index];
    });

    if (normalizeDateForStorage(item.start_at) !== targetDate) {
      continue;
    }

    if (String(item.status || '').toLowerCase() !== 'confirmed') {
      continue;
    }

    if (!isAppointmentStillValid(item)) {
      continue;
    }

    const customer = getCustomerById(item.customer_id);

    const provider = findProviderById(item.provider_id);

    const service = findServiceById(item.service_id);

    const location = findLocationById(item.location_id);

    result.push(
      buildCalendarCacheRow({
        cache_id: 'cache_' + new Date().getTime() + '_' + i,

        cache_date: targetDate,

        source: 'appointment',

        appointment_id: item.appointment_id,

        calendar_event_id: item.calendar_event_id,

        customer_id: item.customer_id,

        customer_name: customer ? customer.name : '',

        phone: customer ? customer.phone : '',

        service_id: item.service_id,

        service_name: service ? service.name : '',

        provider_id: item.provider_id,

        provider_name: provider ? provider.name : '',

        location_id: item.location_id,

        location_name: location ? location.name : '',

        start_at: item.start_at,

        end_at: item.end_at,

        status: item.status,

        title: '',

        description: '',

        customer_note: item.customer_note,

        synced_at: new Date(),

        customer_confirmed: item.customer_confirmed || '',

        customer_confirmed_at: item.customer_confirmed_at || ''
      })
    );
  }

  return result;
}

function buildManualCalendarCacheRows(dateValue) {
  const appointments = getManualCalendarAppointmentsByDateOptimized(dateValue);

  const targetDate = normalizeDateForStorage(dateValue);

  const result = [];

  appointments.forEach(function (item, index) {
    result.push(
      buildCalendarCacheRow({
        cache_id: 'cache_manual_' + new Date().getTime() + '_' + index,

        cache_date: targetDate,

        source: 'calendar_manual',

        appointment_id: '',

        calendar_event_id: item.calendar_event_id || '',

        customer_id: item.customer_id || '',

        customer_name: item.customer_name || '',

        phone: item.phone || '',

        service_id: item.service_id || '',

        service_name: item.service_name || '',

        provider_id: item.provider_id || '',

        provider_name: item.provider_name || '',

        location_id: item.location_id || '',

        location_name: item.location_name || '',

        start_at: item.start_at,

        end_at: item.end_at,

        status: 'confirmed',

        title: item.title || '',

        description: item.description || '',

        customer_note: item.customer_note || '',

        synced_at: new Date()
      })
    );
  });

  return result;
}

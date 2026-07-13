let SERVICES_CACHE = null;
let SERVICES_INCLUDING_INACTIVE_CACHE = null;

function getServices() {
  if (SERVICES_CACHE) {
    return SERVICES_CACHE;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.SERVICES);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function (header, index) {
      item[header] = rows[i][index];
    });

    if (String(item.active).toUpperCase() !== 'TRUE') {
      continue;
    }

    result.push({
      id: item.service_id,
      service_id: item.service_id,
      location_id: item.location_id,
      name: String(item.name || '').trim() || item.service_id,
      duration_min: Number(item.duration_min || 0),
      duration_max: Number(item.duration_max || 0),
      active: String(item.active).toUpperCase() === 'TRUE',
      created_at: item.created_at
    });
  }

  SERVICES_CACHE = result;
  return result;
}

function findServiceById(serviceId) {
  return (
    getServices().find(function (service) {
      return String(service.id) === String(serviceId);
    }) || null
  );
}

function findServiceByName(serviceName) {
  const targetName = String(serviceName || '').trim();

  return (
    getServices().find(function (service) {
      return String(service.name || '').trim() === targetName;
    }) || null
  );
}

function getDefaultServiceDurationMinutes(serviceId) {
  const service = findServiceById(serviceId);

  addAuditLog(
    'SERVICE_DURATION_DEBUG',
    JSON.stringify({
      serviceId: serviceId,
      service: service
    })
  );

  if (!service) {
    return 60;
  }

  const durationMin = Number(service.duration_min || 0);
  const durationMax = Number(service.duration_max || 0);

  if (durationMin > 0 && durationMax > 0) {
    return Math.round((durationMin + durationMax) / 2);
  }

  if (durationMin > 0) {
    return durationMin;
  }

  if (durationMax > 0) {
    return durationMax;
  }

  return 60;
}

function getServiceDurationMinutes(customerId, serviceId) {
  const duration = getCustomerServiceDurationMinutes(customerId, serviceId);

  if (duration) {
    return duration;
  }

  return getDefaultServiceDurationMinutes(serviceId);
}

function getServiceDurationMinutesForSession(session) {
  if (session.customer_phone && session.service_id) {
    const setting = getCustomerServiceSettingByPhoneAndService(session.customer_phone, session.service_id);

    if (setting) {
      const customDuration = Number(setting.duration_minutes);

      if (customDuration > 0) {
        return customDuration;
      }
    }
  }

  return getDefaultServiceDurationMinutes(session.service_id);
}

function getServicesIncludingInactive() {
  if (SERVICES_INCLUDING_INACTIVE_CACHE) {
    return SERVICES_INCLUDING_INACTIVE_CACHE;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.SERVICES);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function (header, index) {
      item[header] = rows[i][index];
    });

    result.push({
      id: item.service_id,
      service_id: item.service_id,
      location_id: item.location_id,
      name: String(item.name || '').trim() || item.service_id,
      duration_min: Number(item.duration_min || 0),
      duration_max: Number(item.duration_max || 0),
      active: String(item.active).toUpperCase() === 'TRUE',
      created_at: item.created_at
    });
  }

  SERVICES_INCLUDING_INACTIVE_CACHE = result;
  return result;
}

function getInactiveServices() {
  return getServicesIncludingInactive().filter(function (service) {
    return service.active !== true;
  });
}

function findInactiveServiceByName(serviceName) {
  const targetName = String(serviceName || '').trim();

  return (
    getInactiveServices().find(function (service) {
      return String(service.name || '').trim() === targetName;
    }) || null
  );
}

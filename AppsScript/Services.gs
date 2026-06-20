// =========================
// SERVICES: READ
// =========================

function getServices() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Services');

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    if (String(item.active).toUpperCase() !== 'TRUE') {
      continue;
    }

    const nameKey = String(item.name_key || '').trim();
    const serviceName = nameKey ? getMessage(nameKey) : '';

    result.push({
      id: item.service_id,
      service_id: item.service_id,
      location_id: item.location_id,
      name_key: nameKey,
      name: serviceName || nameKey || item.service_id,
      price_min: Number(item.price_min || 0),
      price_max: Number(item.price_max || 0),
      duration_min: Number(item.duration_min || 0),
      duration_max: Number(item.duration_max || 0),
      active: String(item.active).toUpperCase() === 'TRUE',
      created_at: item.created_at
    });
  }

  return result;
}

function findServiceById(serviceId) {
  return getServices().find(function(service) {
    return String(service.id) === String(serviceId);
  }) || null;
}

function findServiceByName(serviceName) {
  const targetName = String(serviceName || '').trim();

  return getServices().find(function(service) {
    return String(service.name || '').trim() === targetName;
  }) || null;
}

// =========================
// CUSTOMER SERVICE SETTINGS
// =========================

function getCustomerServiceSetting(
  customerId,
  serviceId,
  providerId
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerServiceSettings');

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return null;
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const customerIdIndex = headers.indexOf('customer_id');
  const serviceIdIndex = headers.indexOf('service_id');
  const providerIdIndex = headers.indexOf('provider_id');
  const durationIndex = headers.indexOf('duration_minutes');
  const priceIndex = headers.indexOf('price');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][customerIdIndex]) === String(customerId) &&
      String(rows[i][serviceIdIndex]) === String(serviceId) &&
      String(rows[i][providerIdIndex]) === String(providerId)
    ) {
      return {
        duration_minutes: Number(rows[i][durationIndex] || 0),
        price: Number(rows[i][priceIndex] || 0)
      };
    }
  }

  return null;
}

function getCustomerServiceDurationMinutes(
  customerId,
  serviceId,
  providerId
) {
  const setting = getCustomerServiceSetting(
    customerId,
    serviceId,
    providerId
  );

  if (setting && setting.duration_minutes > 0) {
    return setting.duration_minutes;
  }

  return null;
}

// =========================
// SERVICE DURATION RESOLUTION
// =========================

function getDefaultServiceDurationMinutes(serviceId) {
  const service = findServiceById(serviceId);

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

function getServiceDurationMinutes(
  customerId,
  serviceId,
  providerId
) {
  const duration = getCustomerServiceDurationMinutes(
    customerId,
    serviceId,
    providerId
  );

  if (duration) {
    return duration;
  }

  return getDefaultServiceDurationMinutes(serviceId);
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

function generateServiceId() {
  return generateNextEntityId(
    'Services',
    'service_id',
    'srv'
  );
}

function generateServiceNameKey(serviceId) {
  const index = String(serviceId).replace('srv_', '');

  return 'SERVICE_NAME_' + index;
}

function createService(serviceData) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Services');

  const serviceId = generateServiceId();

  const nameKey =
    generateServiceNameKey(serviceId);

  createOrUpdateMessageValues(
    nameKey,
    createMessageValuesForAllLanguages(
      serviceData.name
    )
  );

  sheet.appendRow([
    serviceId,
    serviceData.location_id,
    nameKey,
    serviceData.price_min,
    serviceData.price_max,
    serviceData.duration_min,
    serviceData.duration_max,
    true,
    new Date()
  ]);

  return serviceId;
}
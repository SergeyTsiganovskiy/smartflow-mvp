let SERVICES_CACHE = null;
let SERVICES_INCLUDING_INACTIVE_CACHE = null;

// =========================
// SERVICES: READ
// =========================

function getServices() {

  if (SERVICES_CACHE) {
    return SERVICES_CACHE;
  }

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

  SERVICES_CACHE = result;
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
  serviceId
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
  const durationIndex = headers.indexOf('duration_minutes');
  const priceIndex = headers.indexOf('price');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][customerIdIndex]) === String(customerId) &&
      String(rows[i][serviceIdIndex]) === String(serviceId)
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
  serviceId
) {
  const setting = getCustomerServiceSetting(
    customerId,
    serviceId
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

function getServiceDurationMinutes(
  customerId,
  serviceId
) {
  const duration = getCustomerServiceDurationMinutes(
    customerId,
    serviceId
  );

  if (duration) {
    return duration;
  }

  return getDefaultServiceDurationMinutes(serviceId);
}

function getServiceDurationMinutesForSession(session) {
  if (
    session.customer_phone &&
    session.service_id
  ) {
    const setting =
      getCustomerServiceSettingByPhoneAndService(
        session.customer_phone,
        session.service_id
      );

    if (setting) {
      const customDuration =
        Number(
          setting.duration_minutes
        );

      if (customDuration > 0) {
        return customDuration;
      }
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

function updateServiceField(
  serviceId,
  field,
  value
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Services');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const serviceIdIndex = headers.indexOf('service_id');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][serviceIdIndex]) !== String(serviceId)) {
      continue;
    }

    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    if (field === 'name') {
      createOrUpdateMessageValues(
        item.name_key,
        createMessageValuesForAllLanguages(value)
      );

      return true;
    }

    const fieldIndex = headers.indexOf(field);

    if (fieldIndex === -1) {
      throw new Error('Field not found in Services: ' + field);
    }

    sheet
      .getRange(i + 1, fieldIndex + 1)
      .setValue(value);

    return true;
  }

  return false;
}

function setServiceActive(
  serviceId,
  active
) {
  return updateServiceField(
    serviceId,
    'active',
    active
  );
}

function getServicesIncludingInactive() {

  if (SERVICES_INCLUDING_INACTIVE_CACHE) {
    return SERVICES_INCLUDING_INACTIVE_CACHE;
  }

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

  SERVICES_INCLUDING_INACTIVE_CACHE = result;
  return result;
}

function getInactiveServices() {
  return getServicesIncludingInactive()
    .filter(function(service) {
      return service.active !== true;
    });
}

function findInactiveServiceByName(serviceName) {
  const targetName = String(serviceName || '').trim();

  return getInactiveServices().find(function(service) {
    return String(service.name || '').trim() === targetName;
  }) || null;
}

function getCustomerServiceSettingForService(
  customerId,
  serviceId
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

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][customerIdIndex]) === String(customerId) &&
      String(rows[i][serviceIdIndex]) === String(serviceId)
    ) {
      const result = {};

      headers.forEach(function(header, index) {
        result[header] = rows[i][index];
      });

      return result;
    }
  }

  return null;
}

function getCustomerServiceSettingsByPhone(phone) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerServiceSettings');

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const phoneKeyIndex =
    headers.indexOf('phone_key');

  const targetPhoneKey =
    getPhoneSearchKey(phone);

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][phoneKeyIndex]) !== String(targetPhoneKey)) {
      continue;
    }

    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    result.push(item);
  }

  return result;
}

function upsertCustomerServiceSetting(data) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerServiceSettings');

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 1) {
    return false;
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const phoneKeyIndex =
    headers.indexOf('phone_key');

  const serviceIdIndex =
    headers.indexOf('service_id');

  const targetPhoneKey =
    getPhoneSearchKey(
      data.phone || ''
    );

  const targetServiceId =
    String(data.service_id || '').trim();

  for (let i = 1; i < rows.length; i++) {
    const rowPhoneKey =
      String(rows[i][phoneKeyIndex] || '').trim();

    const rowServiceId =
      String(rows[i][serviceIdIndex] || '').trim();

    if (
      rowPhoneKey === targetPhoneKey &&
      rowServiceId === targetServiceId
    ) {
      setRowValueByHeader(sheet, headers, i + 1, 'profile_id', data.profile_id || '');
      setRowValueByHeader(sheet, headers, i + 1, 'phone', data.phone || '');
      setRowValueByHeader(sheet, headers, i + 1, 'customer_name', data.customer_name || '');
      setRowValueByHeader(sheet, headers, i + 1, 'service_name', data.service_name || '');
      setRowValueByHeader(sheet, headers, i + 1, 'duration_minutes', data.duration_minutes);
      setRowValueByHeader(sheet, headers, i + 1, 'price', data.price);
      setRowValueByHeader(sheet, headers, i + 1, 'updated_at', new Date());
      setRowValueByHeader(sheet, headers, i + 1, 'notes', data.notes || '');

      return true;
    }
  }

  const newRow =
    new Array(headers.length).fill('');

  newRow[headers.indexOf('profile_id')] =
    data.profile_id || '';

  newRow[headers.indexOf('phone')] =
    data.phone || '';

  newRow[phoneKeyIndex] =
    targetPhoneKey;

  newRow[headers.indexOf('customer_name')] =
    data.customer_name || '';

  newRow[serviceIdIndex] =
    targetServiceId;

  newRow[headers.indexOf('service_name')] =
    data.service_name || '';

  newRow[headers.indexOf('duration_minutes')] =
    data.duration_minutes;

  newRow[headers.indexOf('price')] =
    data.price;

  newRow[headers.indexOf('updated_at')] =
    new Date();

  newRow[headers.indexOf('notes')] =
    data.notes || '';

  sheet.appendRow(newRow);

  return true;
}

function setRowValueByHeader(sheet, headers, rowNumber, headerName, value) {
  const index = headers.indexOf(headerName);

  if (index === -1) {
    return;
  }

  sheet
    .getRange(rowNumber, index + 1)
    .setValue(value);
}

function deleteCustomerServiceSetting(
  customerId,
  serviceId
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerServiceSettings');

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return false;
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const customerIdIndex = headers.indexOf('customer_id');
  const serviceIdIndex = headers.indexOf('service_id');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][customerIdIndex]) === String(customerId) &&
      String(rows[i][serviceIdIndex]) === String(serviceId)
    ) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }

  return false;
}

function deleteCustomerServiceSettingByPhone(
  phone,
  serviceId
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerServiceSettings');

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return false;
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const phoneKeyIndex =
    headers.indexOf('phone_key');

  const serviceIdIndex =
    headers.indexOf('service_id');

  const targetPhoneKey =
    getPhoneSearchKey(phone);

  for (let i = rows.length - 1; i >= 1; i--) {
    if (
      String(rows[i][phoneKeyIndex]) === String(targetPhoneKey) &&
      String(rows[i][serviceIdIndex]) === String(serviceId)
    ) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }

  return false;
}

function getCustomerServiceSettingByPhoneAndService(
  phone,
  serviceId
) {
  const settings =
    getCustomerServiceSettingsByPhone(phone);

  for (let i = 0; i < settings.length; i++) {
    if (String(settings[i].service_id) === String(serviceId)) {
      return settings[i];
    }
  }

  return null;
}

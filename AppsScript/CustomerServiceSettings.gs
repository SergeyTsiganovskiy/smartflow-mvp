function getCustomerServiceSetting(customerId, serviceId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMER_SERVICE_SETTINGS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return null;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const customerIdIndex = headers.indexOf('customer_id');
  const serviceIdIndex = headers.indexOf('service_id');
  const durationIndex = headers.indexOf('duration_minutes');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][customerIdIndex]) === String(customerId) &&
      String(rows[i][serviceIdIndex]) === String(serviceId)
    ) {
      return {
        duration_minutes: Number(rows[i][durationIndex] || 0)
      };
    }
  }

  return null;
}

function getCustomerServiceDurationMinutes(customerId, serviceId) {
  const setting = getCustomerServiceSetting(customerId, serviceId);

  if (setting && setting.duration_minutes > 0) {
    return setting.duration_minutes;
  }

  return null;
}

function getCustomerServiceSettingForService(customerId, serviceId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMER_SERVICE_SETTINGS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return null;
  }

  const headers = rows[0].map(function (header) {
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

      headers.forEach(function (header, index) {
        result[header] = rows[i][index];
      });

      return result;
    }
  }

  return null;
}

function getCustomerServiceSettingsByPhone(phone) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMER_SERVICE_SETTINGS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const phoneKeyIndex = headers.indexOf('phone_key');

  const targetPhoneKey = getPhoneSearchKey(phone);

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][phoneKeyIndex]) !== String(targetPhoneKey)) {
      continue;
    }

    const item = {};

    headers.forEach(function (header, index) {
      item[header] = rows[i][index];
    });

    result.push(item);
  }

  return result;
}

function getCustomerServiceSettingByPhoneAndService(phone, serviceId) {
  const settings = getCustomerServiceSettingsByPhone(phone);

  for (let i = 0; i < settings.length; i++) {
    if (String(settings[i].service_id) === String(serviceId)) {
      return settings[i];
    }
  }

  return null;
}

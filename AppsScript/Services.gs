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

  const headers = rows[0];

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

  if (
    setting &&
    setting.duration_minutes > 0
  ) {
    return setting.duration_minutes;
  }

  return null;
}

function getServiceDurationMinutes(
  customerId,
  serviceId,
  providerId
) {
  const duration =
    getCustomerServiceDurationMinutes(
      customerId,
      serviceId,
      providerId
    );

  if (duration) {
    return duration;
  }

  return getDefaultServiceDurationMinutes(
    serviceId
  );
}



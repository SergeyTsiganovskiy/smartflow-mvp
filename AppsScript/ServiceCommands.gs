function generateServiceNameKey(serviceId) {
  const index = String(serviceId).replace('srv_', '');

  return 'SERVICE_NAME_' + index;
}

function createService(serviceData) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.SERVICES);

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
    .getSheetByName(SHEET_NAMES.SERVICES);

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

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

  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(function(header) {
      return String(header || '').trim();
    });
  const newRow = new Array(headers.length).fill('');
  const requiredHeaders = [
    'service_id',
    'location_id',
    'name_key',
    'duration_min',
    'duration_max',
    'active',
    'created_at'
  ];

  requiredHeaders.forEach(function(header) {
    if (headers.indexOf(header) === -1) {
      throw new Error('Services sheet is missing column: ' + header);
    }
  });

  newRow[headers.indexOf('service_id')] = serviceId;
  newRow[headers.indexOf('location_id')] = serviceData.location_id;
  newRow[headers.indexOf('name_key')] = nameKey;
  newRow[headers.indexOf('duration_min')] = serviceData.duration_min;
  newRow[headers.indexOf('duration_max')] = serviceData.duration_max;
  newRow[headers.indexOf('active')] = true;
  newRow[headers.indexOf('created_at')] = new Date();

  sheet.appendRow(newRow);

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

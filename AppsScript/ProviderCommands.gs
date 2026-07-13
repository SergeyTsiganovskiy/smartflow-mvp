function createProviderFromAdminSession(session) {
  const providerName =
    String(session.provider_name || '').trim();

  const locationId =
    String(session.provider_location_id || '').trim();

  const phone =
    String(session.provider_phone || '').trim();

  return createProvider({
    name: providerName,
    location_id: locationId,
    phone: phone,
    telegram_id: '',
    calendar_id: ''
  });
}

function createProvider(providerData) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDERS);

  const providerId =
    generateProviderId();

  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(function(header) {
      return String(header || '').trim();
    });
  const newRow = new Array(headers.length).fill('');
  const requiredHeaders = [
    'provider_id',
    'location_id',
    'name',
    'phone',
    'telegram_id',
    'calendar_id',
    'active'
  ];

  requiredHeaders.forEach(function(header) {
    if (headers.indexOf(header) === -1) {
      throw new Error('Providers sheet is missing column: ' + header);
    }
  });

  newRow[headers.indexOf('provider_id')] = providerId;
  newRow[headers.indexOf('location_id')] = providerData.location_id;
  newRow[headers.indexOf('name')] = providerData.name;
  newRow[headers.indexOf('phone')] = providerData.phone;
  newRow[headers.indexOf('telegram_id')] = providerData.telegram_id;
  newRow[headers.indexOf('calendar_id')] = providerData.calendar_id || '';
  newRow[headers.indexOf('active')] = true;

  sheet.appendRow(newRow);

  PROVIDERS_CACHE = null;
  PROVIDERS_INCLUDING_INACTIVE_CACHE = null;

  createDefaultProviderSchedule(providerId);

  return providerId;
}

function updateProviderField(
  providerId,
  field,
  value
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDERS);

  const rows =
    sheet.getDataRange().getValues();

  const headers = rows[0];

  const providerIdIndex =
    headers.indexOf('provider_id');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][providerIdIndex]) !==
      String(providerId)
    ) {
      continue;
    }

    const fieldIndex =
      headers.indexOf(field);

    if (fieldIndex === -1) {
      throw new Error(
        'Field not found: ' +
        field
      );
    }

    sheet
      .getRange(
        i + 1,
        fieldIndex + 1
      )
      .setValue(value);

    PROVIDERS_CACHE = null;
    PROVIDERS_INCLUDING_INACTIVE_CACHE = null;

    return;
  }

  throw new Error(
    'Provider not found: ' +
    providerId
  );
}

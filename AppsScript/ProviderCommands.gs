function createProviderFromAdminSession(session) {
  const providerName =
    String(session.provider_name || '').trim();

  const locationId =
    String(session.provider_location_id || '').trim();

  const phone =
    String(session.provider_phone || '').trim();

  const telegramId =
    String(session.provider_telegram_id || '').trim();

  return createProvider({
    name: providerName,
    location_id: locationId,
    phone: phone,
    telegram_id: telegramId,
    calendar_id: ''
  });
}

function createProvider(providerData) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDERS);

  const providerId =
    generateProviderId();

  const nameKey =
    generateProviderNameKey(providerId);

  createOrUpdateMessageValues(
    nameKey,
    createMessageValuesForAllLanguages(
      providerData.name
    )
  );

  sheet.appendRow([
    providerId,
    providerData.location_id,
    nameKey,
    providerData.phone,
    providerData.telegram_id,
    providerData.calendar_id || '',
    true
  ]);

  createDefaultProviderSchedule(providerId);

  return providerId;
}

function generateProviderNameKey(providerId) {
  return (
    'PROVIDER_NAME_' +
    String(providerId).replace('prov_', '')
  );
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

    const provider = {};

    headers.forEach(function(header, index) {
      provider[header] =
        rows[i][index];
    });

    if (field === 'name') {
      createOrUpdateMessageValues(
        provider.name_key,
        createMessageValuesForAllLanguages(
          value
        )
      );

      return;
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

    return;
  }

  throw new Error(
    'Provider not found: ' +
    providerId
  );
}

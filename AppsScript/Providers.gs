let PROVIDERS_CACHE = null;
let PROVIDERS_INCLUDING_INACTIVE_CACHE = null;

function getProviders() {
  if (PROVIDERS_CACHE) {
    return PROVIDERS_CACHE;
  }

  const providers =
    getProvidersIncludingInactive()
      .filter(function(provider) {
        return String(provider.active).toUpperCase() === 'TRUE' ||
          provider.active === true;
      });

  PROVIDERS_CACHE = providers;

  return PROVIDERS_CACHE;
}

function getInactiveProviders() {
  return getProvidersIncludingInactive()
    .filter(function(provider) {
      return provider.active !== true;
    });
}

function findInactiveProviderByName(name) {
  const targetName = String(name || '').trim();

  return getInactiveProviders().find(function(provider) {
    return String(provider.name || '').trim() === targetName;
  }) || null;
}

function getProvidersIncludingInactive() {

  if (PROVIDERS_INCLUDING_INACTIVE_CACHE) {
    return PROVIDERS_INCLUDING_INACTIVE_CACHE;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Providers');

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

    result.push({
      id: item.provider_id,
      provider_id: item.provider_id,
      location_id: item.location_id,
      name_key: nameKey,
      name: getMessage(nameKey),
      phone: item.phone,
      telegram_id: item.telegram_id,
      calendar_id: item.calendar_id,
      active: String(item.active).toUpperCase() === 'TRUE'
    });
  }

  PROVIDERS_INCLUDING_INACTIVE_CACHE = result;
  return result;
}

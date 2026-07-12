let LOCATIONS_CACHE = null;

function resetLocationsCache() {
  LOCATIONS_CACHE = null;
}

function getActiveLocations() {
  if (LOCATIONS_CACHE) {
    return LOCATIONS_CACHE;
  }
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.LOCATIONS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0];
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    if (String(item.active).toUpperCase() !== 'TRUE') {
      continue;
    }

    result.push({
      id: item.location_id,
      name_key: item.name_key,
      address_key: item.address_key,
      name: getMessage(item.name_key),
      address: getMessage(item.address_key),
      working_hours: item.working_hours,
      instagram: item.instagram,
      telegram: item.telegram,
      website: item.website,
      google_maps_url: item.google_maps_url,
      phone_1: item.phone_1,
      phone_2: item.phone_2,
      active: item.active
    });
  }

  LOCATIONS_CACHE = result;
  return result;
}

function getLocations() {
  return getActiveLocations();
}

function getAllLocations() {
  if (LOCATIONS_CACHE) {
    return LOCATIONS_CACHE;
  }
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.LOCATIONS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0];
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    result.push({
      id: item.location_id,
      name_key: item.name_key,
      address_key: item.address_key,
      name: getMessage(item.name_key),
      address: getMessage(item.address_key),
      working_hours: item.working_hours,
      instagram: item.instagram,
      telegram: item.telegram,
      website: item.website,
      google_maps_url: item.google_maps_url,
      phone_1: item.phone_1,
      phone_2: item.phone_2,
      active: item.active
    });
  }

  LOCATIONS_CACHE = result;
  return result;
}

function findLocationByName(
  name,
  includeInactive
) {
  const searchName =
    String(name || '').trim();

  const locations =
    includeInactive
      ? getAllLocations()
      : getActiveLocations();

  for (let i = 0; i < locations.length; i++) {
    if (
      String(locations[i].name).trim() ===
      searchName
    ) {
      return locations[i];
    }
  }

  return null;
}

function findLocationById(locationId) {
  const locations = getLocations();

  for (let i = 0; i < locations.length; i++) {
    if (String(locations[i].id) === String(locationId)) {
      return locations[i];
    }
  }

  return null;
}

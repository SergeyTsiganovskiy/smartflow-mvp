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
function setLocationActive(
  locationId,
  isActive
) {
  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.LOCATIONS);

  const rows =
    sheet.getDataRange().getValues();

  const headers =
    rows[0];

  const idIndex =
    headers.indexOf('location_id');

  const activeIndex =
    headers.indexOf('active');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][idIndex]) ===
      String(locationId)
    ) {
      sheet
        .getRange(i + 1, activeIndex + 1)
        .setValue(isActive);

      break;
    }
  }

  resetLocationsCache();
}

function disableLocation(locationId) {
  setLocationActive(
    locationId,
    false
  );
}

function enableLocation(locationId) {
  setLocationActive(
    locationId,
    true
  );
}

function updateLocationField(
  locationId,
  field,
  value
) {
  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.LOCATIONS);

  const rows =
    sheet.getDataRange().getValues();

  const headers =
    rows[0];

  const idIndex =
    headers.indexOf('location_id');

  for (let i = 1; i < rows.length; i++) {

    if (
      String(rows[i][idIndex]) !==
      String(locationId)
    ) {
      continue;
    }

    if (field === 'name') {

      const key =
        rows[i][
          headers.indexOf('name_key')
        ];

      createOrUpdateMessageValues(
        key,
        createMessageValuesForAllLanguages(
          value
        )
      );

      break;
    }

    if (field === 'address') {

      const key =
        rows[i][
          headers.indexOf('address_key')
        ];

      createOrUpdateMessageValues(
        key,
        createMessageValuesForAllLanguages(
          value
        )
      );

      break;
    }

    const fieldIndex =
      headers.indexOf(field);

    if (fieldIndex !== -1) {
      sheet
        .getRange(
          i + 1,
          fieldIndex + 1
        )
        .setValue(value);
    }

    break;
  }

  resetLocationsCache();
}

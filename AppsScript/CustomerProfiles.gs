let CUSTOMER_PROFILES_CACHE = null;

function getCustomerProfiles() {
  if (CUSTOMER_PROFILES_CACHE) {
    return CUSTOMER_PROFILES_CACHE;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMER_PROFILES);

  const rows = sheet.getDataRange().getValues();

  const result = [];

  if (rows.length < 2) {
    CUSTOMER_PROFILES_CACHE = result;
    return result;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function (header, index) {
      item[header] = rows[i][index];
    });

    result.push(item);
  }

  CUSTOMER_PROFILES_CACHE = result;
  return result;
}

function findCustomerProfileByPhone(phone) {
  const profiles = getCustomerProfiles();

  const phoneKey = getPhoneSearchKey(phone);

  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];

    if (String(profile.phone_key) === String(phoneKey)) {
      return profile;
    }
  }

  return null;
}

function resetCustomerProfilesCache() {
  CUSTOMER_PROFILES_CACHE = null;
}

function getCustomerProfileById(profileId) {
  const profiles = getCustomerProfiles();

  for (let i = 0; i < profiles.length; i++) {
    if (String(profiles[i].profile_id) === String(profileId)) {
      return profiles[i];
    }
  }

  return null;
}

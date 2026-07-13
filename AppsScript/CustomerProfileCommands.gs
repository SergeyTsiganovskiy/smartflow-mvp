function createCustomerProfile(data) {
  const phone = normalizePhone(data.phone || '');

  if (!phone) {
    return null;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMER_PROFILES);

  const now = new Date();

  const phoneKey = getPhoneSearchKey(phone);

  const profileId = 'profile_' + now.getTime();

  sheet.appendRow([
    profileId,
    phone,
    phoneKey,

    data.name || '',
    data.telegram_id || '',
    data.language || '',

    data.last_visit_at || '',
    data.visit_count || 0,

    data.sales_hint || '',
    data.note || '',

    data.active !== false,

    now,
    now,
    data.synced_at || now
  ]);

  resetCustomerProfilesCache();

  return getCustomerProfileById(profileId);
}

function updateCustomerProfile(profileId, updates) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CUSTOMER_PROFILES);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return false;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const profileIdIndex = headers.indexOf('profile_id');

  if (profileIdIndex === -1) {
    return false;
  }

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][profileIdIndex]) !== String(profileId)) {
      continue;
    }

    Object.keys(updates).forEach(function (key) {
      const columnIndex = headers.indexOf(key);

      if (columnIndex === -1) {
        return;
      }

      rows[i][columnIndex] = updates[key];
    });

    const updatedAtIndex = headers.indexOf('updated_at');

    if (updatedAtIndex !== -1) {
      rows[i][updatedAtIndex] = new Date();
    }

    sheet.getRange(i + 1, 1, 1, headers.length).setValues([rows[i]]);

    resetCustomerProfilesCache();

    return true;
  }

  return false;
}

function deactivateCustomerProfile(profileId) {
  return updateCustomerProfile(profileId, {
    active: false
  });
}

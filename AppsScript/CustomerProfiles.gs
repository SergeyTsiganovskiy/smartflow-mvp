// =========================
// CUSTOMER PROFILES
// =========================
let CUSTOMER_PROFILES_CACHE = null;

function getCustomerProfiles() {
  if (CUSTOMER_PROFILES_CACHE) {
    return CUSTOMER_PROFILES_CACHE;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerProfiles');

  const rows =
    sheet.getDataRange().getValues();

  const result = [];

  if (rows.length < 2) {
    CUSTOMER_PROFILES_CACHE = result;
    return result;
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    result.push(item);
  }

  CUSTOMER_PROFILES_CACHE = result;
  return result;
}

function findCustomerProfileByPhone(phone) {
  const profiles =
    getCustomerProfiles();

  const phoneKey =
    getPhoneSearchKey(phone);

  for (let i = 0; i < profiles.length; i++) {
    const profile =
      profiles[i];

    if (
      String(profile.phone_key) ===
      String(phoneKey)
    ) {
      return profile;
    }
  }

  return null;
}

function resetCustomerProfilesCache() {
  CUSTOMER_PROFILES_CACHE = null;
}

function createCustomerProfile(data) {
  const phone =
    normalizePhone(
      data.phone || ''
    );

  if (!phone) {
    return null;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(
      'CustomerProfiles'
    );

  const now =
    new Date();

  const phoneKey =
    getPhoneSearchKey(phone);

  const profileId =
    'profile_' +
    now.getTime();

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

  return getCustomerProfileById(
    profileId
  );
}

function getCustomerProfileById(profileId) {
  const profiles =
    getCustomerProfiles();

  for (let i = 0; i < profiles.length; i++) {
    if (
      String(profiles[i].profile_id) ===
      String(profileId)
    ) {
      return profiles[i];
    }
  }

  return null;
}

function updateCustomerProfile(
  profileId,
  updates
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(
      'CustomerProfiles'
    );

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return false;
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const profileIdIndex =
    headers.indexOf(
      'profile_id'
    );

  if (profileIdIndex === -1) {
    return false;
  }

  for (let i = 1; i < rows.length; i++) {
    if (
      String(
        rows[i][profileIdIndex]
      ) !== String(profileId)
    ) {
      continue;
    }

    Object.keys(updates).forEach(
      function(key) {
        const columnIndex =
          headers.indexOf(key);

        if (columnIndex === -1) {
          return;
        }

        rows[i][columnIndex] =
          updates[key];
      }
    );

    const updatedAtIndex =
      headers.indexOf(
        'updated_at'
      );

    if (updatedAtIndex !== -1) {
      rows[i][updatedAtIndex] =
        new Date();
    }

    sheet
      .getRange(
        i + 1,
        1,
        1,
        headers.length
      )
      .setValues([
        rows[i]
      ]);

    resetCustomerProfilesCache();

    return true;
  }

  return false;
}

function deactivateCustomerProfile(
  profileId
) {
  return updateCustomerProfile(
    profileId,
    {
      active: false
    }
  );
}

function syncCustomerProfiles() {
  const profiles =
    getCustomerProfiles();

  const profileByPhoneKey = {};

  profiles.forEach(function(profile) {
    const phoneKey =
      String(profile.phone_key || '');

    if (!phoneKey) {
      return;
    }

    profileByPhoneKey[phoneKey] =
      profile;
  });

  const customers =
    getCustomers();

  const customerByPhoneKey = {};

  customers.forEach(function(customer) {
    const phoneKey =
      getPhoneSearchKey(
        customer.phone
      );

    if (!phoneKey) {
      return;
    }

    customerByPhoneKey[phoneKey] =
      customer;
  });

  const statsByPhoneKey =
    buildCustomerVisitStatsFromVisitHistory();

  Object.keys(statsByPhoneKey).forEach(function(phoneKey) {
    const stats =
      statsByPhoneKey[phoneKey];

    const customer =
      customerByPhoneKey[phoneKey] || {};

    const existingProfile =
      profileByPhoneKey[phoneKey];

    if (!existingProfile) {
      const createdProfile =
        createCustomerProfile({
          phone:
            stats.phone || customer.phone || '',

          name:
            stats.customer_name || customer.name || '',

          telegram_id:
            customer.telegram_id || '',

          language:
            customer.language || '',

          last_visit_at:
            stats.last_visit_at || '',

          visit_count:
            stats.visit_count || 0,

          active:
            true,

          synced_at:
            new Date()
        });

      if (createdProfile) {
        profileByPhoneKey[phoneKey] =
          createdProfile;
      }

      return;
    }

    updateCustomerProfile(
      existingProfile.profile_id,
      {
        telegram_id:
          customer.telegram_id || existingProfile.telegram_id || '',

        language:
          customer.language || existingProfile.language || '',

        last_visit_at:
          stats.last_visit_at || '',

        visit_count:
          stats.visit_count || 0,

        synced_at:
          new Date()
      }
    );
  });
}

function buildCustomerVisitStatsFromVisitHistory() {
  const visits =
    getCustomerVisitHistoryRows();

  const result = {};

  visits.forEach(function(visit) {
    const phoneKey =
      String(visit.phone_key || '');

    if (!phoneKey) {
      return;
    }

    if (!result[phoneKey]) {
      result[phoneKey] = {
        phone:
          visit.phone || '',

        customer_name:
          visit.customer_name || '',

        visit_count:
          0,

        last_visit_at:
          ''
      };
    }

    result[phoneKey].visit_count++;

    if (
      !result[phoneKey].last_visit_at ||
      new Date(visit.start_at) >
        new Date(result[phoneKey].last_visit_at)
    ) {
      result[phoneKey].last_visit_at =
        visit.start_at;

      result[phoneKey].customer_name =
        visit.customer_name || result[phoneKey].customer_name;
    }
  });

  return result;
}

function startCreateCustomerProfile(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_CREATE_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_CUSTOMER_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processCreateCustomerProfilePhone(
  chatId,
  text,
  settings
) {
  const profile =
    findCustomerProfileByPhone(text);

  if (profile) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_PROFILE_ALREADY_EXISTS
      ) +
        '\n\n' +
        getMessage(
          MESSAGE_KEYS.ENTER_CUSTOMER_PHONE
        ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'new_customer_phone',
    normalizePhone(text)
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_CREATE_NAME
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_ENTER_NAME
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processCreateCustomerProfileName(
  chatId,
  text,
  settings
) {
  const session =
    getUserSession(chatId) || {};

  const phone =
    session.new_customer_phone;

  if (!phone) {
    setUserState(chatId, '');

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_NOT_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  createCustomerProfile({
    phone: phone,
    name: text
  });

  setUserSessionValue(
    chatId,
    'new_customer_phone',
    ''
  );

  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_CREATED
    ),
    buildKeyboardWithMainMenu([])
  );
}

function startDeleteCustomerProfile(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_DELETE_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_CUSTOMER_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processDeleteCustomerProfilePhone(
  chatId,
  text,
  settings
) {
  const profile =
    findCustomerProfileByPhone(text);

  if (!profile || profile.active === false) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_NOT_FOUND
      ) +
        '\n\n' +
        getMessage(
          MESSAGE_KEYS.ENTER_CUSTOMER_PHONE
        ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  deactivateCustomerProfile(
    profile.profile_id
  );

  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_DELETED
    ),
    buildKeyboardWithMainMenu([])
  );
}



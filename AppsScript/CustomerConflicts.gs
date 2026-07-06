function startCustomerConflicts(
  chatId,
  settings
) {
  navigateAdmin(
    chatId,
    ADMIN_MENUS.CUSTOMER_CONFLICTS
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICTS_MENU
    ),
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(
            MESSAGE_KEYS.CUSTOMER_CONFLICT_ADD
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.CUSTOMER_CONFLICT_LIST
          )
        },
        {
          text: getMessage(
            MESSAGE_KEYS.CUSTOMER_CONFLICT_DELETE
          )
        }
      ]
    ])
  );
}

function startAddCustomerConflict(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_MAIN_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_MAIN_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processCustomerConflictMainPhone(
  chatId,
  text,
  settings
) {
  const phone =
    normalizePhone(text);

  const profile =
    findCustomerProfileByPhone(phone);

  if (!profile || profile.active === false) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValues(
    chatId,
    {
      conflict_main_phone: profile.phone,
      conflict_main_phone_key: profile.phone_key,
      conflict_main_customer_name: profile.name
    }
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_CONFLICT_PHONE
    ),
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(
            MESSAGE_KEYS.CUSTOMER_CONFLICTS_DONE
          )
        }
      ]
    ])
  );
}

function processCustomerConflictPhone(
  chatId,
  text,
  settings
) {
  if (
    text ===
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICTS_DONE
    )
  ) {
    startCustomerConflicts(
      chatId,
      settings
    );

    return;
  }

  const phone =
    normalizePhone(text);

  const phoneKey =
    getPhoneSearchKey(phone);

  const profile =
    findCustomerProfileByPhone(phone);

  const session =
    getUserSession(chatId);

  if (
    phoneKey ===
    String(session.conflict_main_phone_key)
  ) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_SELF_NOT_ALLOWED),
      buildConflictAddKeyboard()
    );

    return;
  }

  const created =
    createCustomerConflict({
      phone:
        session.conflict_main_phone,

      phone_key:
        session.conflict_main_phone_key,

      customer_name:
        session.conflict_main_customer_name,

      conflict_phone:
        phone,

      conflict_phone_key:
        phoneKey,

      conflict_customer_name:
        profile && profile.active !== false
          ? profile.name || ''
          : ''
    });

  if (!created) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_CONFLICT_ALREADY_EXISTS
      ),
      buildConflictAddKeyboard()
    );

    return;
  }

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_ADDED
    ) +
      '\n\n' +
      getMessage(
        MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_CONFLICT_PHONE
      ),
    buildConflictAddKeyboard()
  );
}

function buildConflictAddKeyboard() {
  return buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(
          MESSAGE_KEYS.CUSTOMER_CONFLICTS_DONE
        )
      }
    ]
  ]);
}

function createCustomerConflict(data) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerConflicts');

  const rows =
    sheet.getDataRange().getValues();

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const phoneKeyIndex =
    headers.indexOf('phone_key');

  const conflictPhoneKeyIndex =
    headers.indexOf('conflict_phone_key');

  const activeIndex =
    headers.indexOf('active');

  for (let i = 1; i < rows.length; i++) {
    const phoneKey =
      String(rows[i][phoneKeyIndex]);

    const conflictPhoneKey =
      String(rows[i][conflictPhoneKeyIndex]);

    const active =
      String(rows[i][activeIndex]) !== 'FALSE';

    if (!active) {
      continue;
    }

    if (
      (
        phoneKey === String(data.phone_key) &&
        conflictPhoneKey === String(data.conflict_phone_key)
      ) ||
      (
        phoneKey === String(data.conflict_phone_key) &&
        conflictPhoneKey === String(data.phone_key)
      )
    ) {
      return false;
    }
  }

  const newRow =
    new Array(headers.length).fill('');

  newRow[
    headers.indexOf('conflict_id')
  ] =
    generateId('conflict');

  newRow[
    headers.indexOf('phone')
  ] =
    data.phone;

  newRow[
    headers.indexOf('phone_key')
  ] =
    data.phone_key;

  newRow[
    headers.indexOf('customer_name')
  ] =
    data.customer_name;

  newRow[
    headers.indexOf('conflict_phone')
  ] =
    data.conflict_phone;

  newRow[
    headers.indexOf('conflict_phone_key')
  ] =
    data.conflict_phone_key;

  newRow[
    headers.indexOf('conflict_customer_name')
  ] =
    data.conflict_customer_name;

  newRow[
    headers.indexOf('active')
  ] =
    true;

  newRow[
    headers.indexOf('created_at')
  ] =
    new Date();

  newRow[
    headers.indexOf('updated_at')
  ] =
    new Date();

  newRow[
    headers.indexOf('notes')
  ] =
    '';

  sheet.appendRow(newRow);

  return true;
}

function startListCustomerConflicts(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_LIST_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_MAIN_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function getCustomerConflictsByPhone(
  phone
) {
  const phoneKey =
    getPhoneSearchKey(phone);

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        'CustomerConflicts'
      );

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] =
        rows[i][index];
    });

    if (item.active === false) {
      continue;
    }

    if (
      String(item.phone_key) === phoneKey
    ) {
      result.push({
        phone:
          item.conflict_phone,
        customer_name:
          item.conflict_customer_name
      });

      continue;
    }

    if (
      String(item.conflict_phone_key) === phoneKey
    ) {
      result.push({
        phone:
          item.phone,
        customer_name:
          item.customer_name
      });
    }
  }

  return result;
}

function startShowCustomerConflicts(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_LIST_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_MAIN_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function getCustomerConflictsByPhone(
  phone
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerConflicts');

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const phoneKey =
    getPhoneSearchKey(phone);

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    if (item.active === false) {
      continue;
    }

    if (
      String(item.phone_key) ===
      String(phoneKey)
    ) {
      result.push({
        phone: item.conflict_phone,
        customer_name:
          item.conflict_customer_name
      });

      continue;
    }

    if (
      String(item.conflict_phone_key) ===
      String(phoneKey)
    ) {
      result.push({
        phone: item.phone,
        customer_name:
          item.customer_name
      });
    }
  }

  return result;
}

function processShowCustomerConflicts(
  chatId,
  text,
  settings
) {
  const phone =
    normalizePhone(text);

  const profile =
    findCustomerProfileByPhone(phone);

  if (!profile || profile.active === false) {
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

  const conflicts =
    getCustomerConflictsByPhone(phone);

  let message =
    '<b>' +
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_LIST
    ) +
    '</b>\n\n';

  message +=
    profile.name +
    '\n';

  message +=
    profile.phone +
    '\n\n';

  if (conflicts.length === 0) {
    message +=
      getMessage(
        MESSAGE_KEYS.CUSTOMER_CONFLICTS_EMPTY
      );
  } else {
    conflicts.forEach(function(item, index) {
      const name =
        String(item.customer_name || '').trim();

      const phone =
        String(item.phone || '').trim();

      message +=
        String(index + 1) +
        '. ' +
        (name || '-') +
        '\n';

      message +=
        phone +
        '\n\n';
    });
  }

  setUserState(
    chatId,
    ''
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    message,
    buildKeyboardWithMainMenu([])
  );
}

function getCustomerConflictPhoneKeys(phone) {
  const phoneKey =
    getPhoneSearchKey(phone);

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerConflicts');

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const phoneKeyIndex =
    headers.indexOf('phone_key');

  const conflictPhoneKeyIndex =
    headers.indexOf('conflict_phone_key');

  const activeIndex =
    headers.indexOf('active');

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const active =
      String(rows[i][activeIndex]).toUpperCase() !== 'FALSE';

    if (!active) {
      continue;
    }

    const rowPhoneKey =
      String(rows[i][phoneKeyIndex] || '');

    const rowConflictPhoneKey =
      String(rows[i][conflictPhoneKeyIndex] || '');

    if (rowPhoneKey === String(phoneKey)) {
      result.push(rowConflictPhoneKey);
      continue;
    }

    if (rowConflictPhoneKey === String(phoneKey)) {
      result.push(rowPhoneKey);
    }
  }

  return result;
}

function getConflictAppointmentsForDate(
  customerPhone,
  dateValue
) {
  const phoneKeys =
    getCustomerConflictPhoneKeys(
      customerPhone
    );

  if (phoneKeys.length === 0) {
    return [];
  }

  const appointments =
    getCachedAppointmentsByDate(
      normalizeDateForStorage(dateValue)
    );

  return appointments.filter(function(item) {
    const itemPhoneKey =
      getPhoneSearchKey(
        item.phone
      );

    return phoneKeys.indexOf(
      String(itemPhoneKey)
    ) !== -1;
  });
}

function startDeleteCustomerConflict(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_DELETE_MAIN_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_DELETE_MAIN_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processDeleteCustomerConflictMainPhone(
  chatId,
  text,
  settings
) {
  const phone =
    normalizePhone(text);

  const profile =
    findCustomerProfileByPhone(phone);

  if (
    !profile ||
    profile.active === false
  ) {
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

  setUserSessionValues(
    chatId,
    {
      delete_conflict_main_phone:
        profile.phone,

      delete_conflict_main_phone_key:
        profile.phone_key,

      delete_conflict_main_customer_name:
        profile.name
    }
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_DELETE_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_DELETE_PHONE
    ),
    buildConflictAddKeyboard()
  );
}

function deactivateCustomerConflict(
  phoneKey,
  conflictPhoneKey
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CustomerConflicts');

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return false;
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const phoneKeyIndex =
    headers.indexOf('phone_key');

  const conflictPhoneKeyIndex =
    headers.indexOf('conflict_phone_key');

  const activeIndex =
    headers.indexOf('active');

  const updatedAtIndex =
    headers.indexOf('updated_at');

  for (let i = 1; i < rows.length; i++) {
    const rowPhoneKey =
      String(rows[i][phoneKeyIndex] || '');

    const rowConflictPhoneKey =
      String(rows[i][conflictPhoneKeyIndex] || '');

    const active =
      String(rows[i][activeIndex]).toUpperCase() !== 'FALSE' &&
      rows[i][activeIndex] !== false;

    if (!active) {
      continue;
    }

    const matched =
      (
        rowPhoneKey === String(phoneKey) &&
        rowConflictPhoneKey === String(conflictPhoneKey)
      ) ||
      (
        rowPhoneKey === String(conflictPhoneKey) &&
        rowConflictPhoneKey === String(phoneKey)
      );

    if (!matched) {
      continue;
    }

    sheet
      .getRange(i + 1, activeIndex + 1)
      .setValue(false);

    sheet
      .getRange(i + 1, updatedAtIndex + 1)
      .setValue(new Date());

    return true;
  }

  return false;
}

function processDeleteCustomerConflictPhone(
  chatId,
  text,
  settings
) {
  if (
    text ===
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICTS_DONE
    )
  ) {
    startCustomerConflicts(
      chatId,
      settings
    );

    return;
  }

  const phone =
    normalizePhone(text);

  const session =
    getUserSession(chatId);

  const deleted =
    deactivateCustomerConflict(
      session.delete_conflict_main_phone_key,
      getPhoneSearchKey(phone)
    );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    deleted
      ? getMessage(
          MESSAGE_KEYS.CUSTOMER_CONFLICT_DELETED
        )
      : getMessage(
          MESSAGE_KEYS.CUSTOMER_CONFLICT_NOT_FOUND
        ),
    buildConflictAddKeyboard()
  );
}
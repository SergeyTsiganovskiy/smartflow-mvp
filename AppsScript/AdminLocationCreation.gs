function startCreateLocation(
  chatId,
  settings
) {
  navigateAdmin(
    chatId,
    ADMIN_MENUS.LOCATIONS,
    ADMIN_STATES.WAITING_LOCATION_NAME
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_LOCATION_NAME),
    buildKeyboardWithMainMenu([])
  );
}

function processLocationName(
  chatId,
  text,
  settings
) {
  setUserSessionValue(
    chatId,
    'location_name',
    text
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_LOCATION_ADDRESS
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_LOCATION_ADDRESS
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processLocationAddress(
  chatId,
  text,
  settings
) {
  setUserSessionValue(
    chatId,
    'location_address',
    text
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_LOCATION_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_LOCATION_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processLocationPhone(
  chatId,
  text,
  settings
) {
  setUserSessionValue(
    chatId,
    'location_phone',
    text
  );

  createLocationFromSession(
    chatId
  );

  resetLocationWizardSession(
    chatId
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.LOCATION_CREATED
    )
  );

  addAuditLog(
    'LOCATION_CREATED_STACK_DEBUG',
    JSON.stringify({
      stack: getNavigationStack(chatId),
      current: getCurrentNavigation(chatId)
    })
  );

  backToAdminMenu(
    chatId,
    settings,
    ADMIN_MENUS.LOCATIONS
  );
}

function resetLocationWizardSession(chatId) {
  setUserSessionValues(
    chatId,
    {
      location_name: '',
      location_address: '',
      location_phone: '',

      edit_location_id: '',
      edit_location_field: ''
    }
  );

  setUserState(
    chatId,
    ''
  );
}

function createLocationFromSession(chatId) {
  const session =
    getUserSession(chatId);

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.LOCATIONS);

  const rows =
    sheet.getDataRange().getValues();

  const nextNumber =
    rows.length;

  const paddedNumber =
    String(nextNumber).padStart(3, '0');

  const locationId =
    'loc_' + paddedNumber;

  const nameKey =
    'LOCATION_NAME_' + paddedNumber;

  const addressKey =
    'LOCATION_ADDRESS_' + paddedNumber;

  createOrUpdateMessageValues(
    nameKey,
    createMessageValuesForAllLanguages(
      session.location_name
    )
  );

  createOrUpdateMessageValues(
    addressKey,
    createMessageValuesForAllLanguages(
      session.location_address
    )
  );

  sheet.appendRow([
    locationId,
    nameKey,
    addressKey,
    '',
    '',
    '',
    '',
    '',
    session.location_phone || '',
    '',
    true
  ]);

  if (typeof resetLocationsCache === 'function') {
    resetLocationsCache();
  } else {
    LOCATIONS_CACHE = null;
  }
}

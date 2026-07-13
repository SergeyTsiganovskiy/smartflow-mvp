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

  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(function(header) {
      return String(header || '').trim();
    });
  const newRow = new Array(headers.length).fill('');
  const requiredHeaders = [
    'location_id',
    'name',
    'address',
    'phone_1',
    'active'
  ];

  requiredHeaders.forEach(function(header) {
    if (headers.indexOf(header) === -1) {
      throw new Error('Locations sheet is missing column: ' + header);
    }
  });

  newRow[headers.indexOf('location_id')] = locationId;
  newRow[headers.indexOf('name')] = session.location_name;
  newRow[headers.indexOf('address')] = session.location_address;
  newRow[headers.indexOf('phone_1')] = session.location_phone || '';
  newRow[headers.indexOf('active')] = true;

  sheet.appendRow(newRow);

  if (typeof resetLocationsCache === 'function') {
    resetLocationsCache();
  } else {
    LOCATIONS_CACHE = null;
  }
}

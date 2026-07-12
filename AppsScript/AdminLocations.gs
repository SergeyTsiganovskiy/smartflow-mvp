
function sendLocationsMenu(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_LOCATIONS_MENU
  );

  pushNavigation(
    chatId,
    ADMIN_MENUS.LOCATIONS
  );

  const keyboard =
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATIONS_LIST
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_ADD
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_EDIT
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_DISABLE
          )
        },
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_ENABLE
          )
        }
      ]
    ]);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.LOCATIONS_MENU_TITLE
    ),
    keyboard
  );
}

function showLocationsListAdmin(
  chatId,
  settings
) {
  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.LOCATIONS
  );

  const locations =
    getLocations();

  if (locations.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_LOCATIONS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.LOCATIONS_LIST_TITLE) +
    '</b>\n\n';

  locations.forEach(function(location, index) {
    text +=
      String(index + 1) +
      '. <b>' +
      (location.name || '-') +
      '</b>\n';

    text +=
      '📍 ' +
      (location.address || '-') +
      '\n';

    text +=
      '📞 ' +
      (location.phone_1 || '-') +
      '\n';

    if (location.phone_2) {
      text +=
        '📞 ' +
        location.phone_2 +
        '\n';
    }

    text +=
      '🕒 ' +
      (location.working_hours || '-') +
      '\n';

    text += '\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}

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
      .getSheetByName('Locations');

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

function processDisableLocation(
  chatId,
  text,
  settings
) {
  processLocationActiveChange(
    chatId,
    text,
    settings,
    {
      includeInactive: false,
      activate: false,
      successMessage: MESSAGE_KEYS.LOCATION_DISABLED
    }
  );
}

function setLocationActive(
  locationId,
  isActive
) {
  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName('Locations');

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

function startDisableLocation(
  chatId,
  settings
) {
  startLocationSelection(
    chatId,
    settings,
    {
      state:
        ADMIN_STATES.WAITING_LOCATION_TO_DISABLE,

      locations:
        getActiveLocations(),

      emptyMessageKey:
        MESSAGE_KEYS.NO_ACTIVE_LOCATIONS
    }
  );
}

function startEnableLocation(
  chatId,
  settings
) {
  startLocationSelection(
    chatId,
    settings,
    {
      state:
        ADMIN_STATES.WAITING_LOCATION_TO_ENABLE,

      locations:
        getAllLocations().filter(function(location) {
          return (
            String(location.active)
              .toUpperCase() !== 'TRUE'
          );
        }),

      emptyMessageKey:
        MESSAGE_KEYS.NO_DISABLED_LOCATIONS
    }
  );
}

function processEnableLocation(
  chatId,
  text,
  settings
) {
  processLocationActiveChange(
    chatId,
    text,
    settings,
    {
      includeInactive: true,
      activate: true,
      successMessage: MESSAGE_KEYS.LOCATION_ENABLED
    }
  );
}

function enableLocation(locationId) {
  setLocationActive(
    locationId,
    true
  );
}

function startLocationSelection(
  chatId,
  settings,
  options
) {
  setUserState(
    chatId,
    options.state
  );

  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.LOCATIONS
  );

  const keyboardRows = [];

  options.locations.forEach(function(location) {
    keyboardRows.push([
      {
        text: location.name
      }
    ]);
  });

  if (keyboardRows.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        options.emptyMessageKey
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_LOCATION
    ),
    buildKeyboardWithMainMenu(
      keyboardRows
    )
  );
}

function processLocationActiveChange(
  chatId,
  text,
  settings,
  options
) {
  const location =
    findLocationByName(
      text,
      options.includeInactive
    );

  if (
    !location ||
    String(location.active).toUpperCase() ===
      String(options.activate).toUpperCase()
  ) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.LOCATION_SELECT_FROM_LIST)
    );

    return;
  }

  setLocationActive(
    location.id,
    options.activate
  );

  clearUserSession(chatId);
  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(options.successMessage)
  );

  sendLocationsMenu(chatId, settings);
}

function startEditLocation(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_LOCATION_TO_EDIT
  );

  const keyboardRows = [];

  getAllLocations().forEach(function(location) {
    keyboardRows.push([
      {
        text: location.name
      }
    ]);
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_LOCATION
    ),
    buildKeyboardWithMainMenu(
      keyboardRows
    )
  );
}

function processLocationToEdit(
  chatId,
  text,
  settings
) {
  const location =
    findLocationByName(
      text,
      true
    );

  if (!location) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.LOCATION_SELECT_FROM_LIST
      )
    );

    return;
  }

  showLocationEditFields(
    chatId,
    location.id,
    settings
  );
}

function showLocationEditFields(
  chatId,
  locationId,
  settings
) {
  setUserSessionValue(
    chatId,
    'edit_location_id',
    locationId
  );

  setUserSessionValue(
    chatId,
    'edit_location_field',
    ''
  );

  setPreviousMenu(
    chatId,
    'LOCATION_EDIT_FIELDS'
  );

  const keyboard =
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_FIELD_NAME
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_FIELD_ADDRESS
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_FIELD_PHONE_1
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_FIELD_PHONE_2
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_FIELD_WORKING_HOURS
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_FIELD_INSTAGRAM
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_FIELD_TELEGRAM
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_FIELD_WEBSITE
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.LOCATION_FIELD_GOOGLE_MAPS
          )
        }
      ]
    ]);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_LOCATION_FIELD_TO_EDIT
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_LOCATION_FIELD
    ),
    keyboard
  );
}

function processLocationFieldSelection(
  chatId,
  text,
  settings
) {
  const fieldMap = {};

  fieldMap[
    getMessage(MESSAGE_KEYS.LOCATION_FIELD_NAME)
  ] = 'name';

  fieldMap[
    getMessage(MESSAGE_KEYS.LOCATION_FIELD_ADDRESS)
  ] = 'address';

  fieldMap[
    getMessage(MESSAGE_KEYS.LOCATION_FIELD_PHONE_1)
  ] = 'phone_1';

  fieldMap[
    getMessage(MESSAGE_KEYS.LOCATION_FIELD_PHONE_2)
  ] = 'phone_2';

  fieldMap[
    getMessage(MESSAGE_KEYS.LOCATION_FIELD_WORKING_HOURS)
  ] = 'working_hours';

  fieldMap[
    getMessage(MESSAGE_KEYS.LOCATION_FIELD_INSTAGRAM)
  ] = 'instagram';

  fieldMap[
    getMessage(MESSAGE_KEYS.LOCATION_FIELD_TELEGRAM)
  ] = 'telegram';

  fieldMap[
    getMessage(MESSAGE_KEYS.LOCATION_FIELD_WEBSITE)
  ] = 'website';

  fieldMap[
    getMessage(MESSAGE_KEYS.LOCATION_FIELD_GOOGLE_MAPS)
  ] = 'google_maps_url';

  const field =
    fieldMap[text];

  if (!field) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.SELECT_LOCATION_FIELD
      )
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'edit_location_field',
    field
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_LOCATION_NEW_VALUE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_NEW_VALUE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processLocationNewValue(
  chatId,
  text,
  settings
) {
  const session =
    getUserSession(chatId);

  const locationId =
    session.edit_location_id;

  const field =
    session.edit_location_field;

  updateLocationField(
    locationId,
    field,
    text
  );

  resetLocationsCache();

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.LOCATION_UPDATED
    )
  );

  showLocationEditFields(
    chatId,
    locationId,
    settings
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
      .getSheetByName('Locations');

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

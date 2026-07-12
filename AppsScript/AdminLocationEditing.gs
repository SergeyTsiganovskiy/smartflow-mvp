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

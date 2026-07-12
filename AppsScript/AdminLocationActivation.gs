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

function sendLocationsMenu(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_LOCATIONS_MENU);

  pushNavigation(chatId, ADMIN_MENUS.LOCATIONS);

  const keyboard = buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(MESSAGE_KEYS.LOCATIONS_LIST)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.LOCATION_ADD)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.LOCATION_EDIT)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.LOCATION_DISABLE)
      },
      {
        text: getMessage(MESSAGE_KEYS.LOCATION_ENABLE)
      }
    ]
  ]);

  sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.LOCATIONS_MENU_TITLE), keyboard);
}

function showLocationsListAdmin(chatId, settings) {
  setUserSessionValue(chatId, 'admin_back_menu', ADMIN_MENUS.LOCATIONS);

  const locations = getLocations();

  if (locations.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_LOCATIONS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text = '<b>' + getMessage(MESSAGE_KEYS.LOCATIONS_LIST_TITLE) + '</b>\n\n';

  locations.forEach(function (location, index) {
    text += String(index + 1) + '. <b>' + (location.name || '-') + '</b>\n';

    text += '📍 ' + (location.address || '-') + '\n';

    text += '📞 ' + (location.phone_1 || '-') + '\n';

    if (location.phone_2) {
      text += '📞 ' + location.phone_2 + '\n';
    }

    text += '🕒 ' + (location.working_hours || '-') + '\n';

    text += '\n';
  });

  sendTelegramMessage(settings.AdminBotToken, chatId, text, buildKeyboardWithMainMenu([]));
}

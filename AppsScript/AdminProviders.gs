
function sendProvidersMenu(chatId, settings) {
  navigateAdmin(chatId, ADMIN_MENUS.PROVIDERS);

  addAuditLog(
  'SEND_PROVIDERS_MENU_CALLED',
  JSON.stringify({
    stack: getNavigationStack(chatId)
  })
);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_PROVIDERS),
    buildProvidersMenuKeyboard()
  );
}







function showProvidersListAdmin(chatId, settings) {
  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.PROVIDERS
  );

  const providers = getProviders();

  if (providers.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_PROVIDERS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.PROVIDERS_LIST_TITLE) +
    '</b>\n\n';

  providers.forEach(function(provider, index) {
    const location =
      findLocationById(provider.location_id);

    text +=
      String(index + 1) +
      '. <b>' +
      provider.name +
      '</b>\n';

    text +=
      '📍 ' +
      (location ? location.name : provider.location_id) +
      '\n';

    if (provider.phone) {
      text +=
        '📞 ' +
        provider.phone +
        '\n';
    }

    text += '\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}



function buildProvidersMenuKeyboard(additionalRows) {
  const rows = additionalRows || [];

  rows.push(
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_ADD_PROVIDER
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_PROVIDER_LIST
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_PROVIDER_EDIT
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_PROVIDER_DISABLE
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_PROVIDER_ENABLE
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_PROVIDER_SCHEDULE
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_PROVIDER_OVERRIDES
        )
      }
    ]
  );

  return buildKeyboardWithMainMenu(rows);
}










function resetProviderWizardSession(chatId) {
  setUserSessionValues(
    chatId,
    {
      provider_name: '',
      provider_location_id: '',
      provider_phone: '',

      edit_provider_id: '',
      edit_provider_field: '',
      edit_provider_new_value: ''
    }
  );
}

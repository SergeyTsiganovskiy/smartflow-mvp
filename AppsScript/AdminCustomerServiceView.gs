function startCustomerServices(chatId, settings) {
  navigateAdmin(chatId, ADMIN_MENUS.SERVICES, ADMIN_STATES.WAITING_CUSTOMER_SERVICE_PHONE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_CUSTOMER_PHONE),
    buildKeyboardWithMainMenu([])
  );
}

function processCustomerServicePhone(chatId, text, settings) {
  const phone = normalizePhone(text);

  const customer = getCustomerByPhone(phone);

  const profile = findCustomerProfileByPhone(phone);

  if (!profile || profile.active === false) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValues(chatId, {
    customer_service_customer_id: customer ? customer.customer_id : '',

    customer_service_phone: profile.phone
  });

  showCustomerServices(chatId, profile, settings);
}

function showCustomerServices(chatId, customer, settings) {
  setUserState(chatId, '');
  setPreviousMenu(chatId, 'SERVICES_MENU');

  const customerSettings = getCustomerServiceSettingsByPhone(customer.phone);

  let text = '<b>' + getMessage(MESSAGE_KEYS.CUSTOMER_SERVICES_TITLE) + '</b>\n\n';

  text += customer.name + '\n';

  text += customer.phone + '\n\n';

  if (customerSettings.length === 0) {
    text += getMessage(MESSAGE_KEYS.NO_CUSTOMER_SERVICE_SETTINGS) + '\n';
  } else {
    customerSettings.forEach(function (setting, index) {
      text += String(index + 1) + '. <b>' + (setting.service_name || setting.service_id) + '</b>\n';

      text +=
        getMessage(MESSAGE_KEYS.CUSTOM_DURATION_LABEL) +
        ': ' +
        setting.duration_minutes +
        ' ' +
        getMessage(MESSAGE_KEYS.MINUTES_SHORT) +
        '\n';

      if (setting.provider_name) {
        text += '👩‍💼 ' + setting.provider_name + '\n';
      }

      if (setting.notes) {
        text += setting.notes + '\n';
      }

      text += '\n';
    });
  }

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([
      [{ text: getMessage(MESSAGE_KEYS.EDIT_CUSTOMER_SERVICE) }],
      [{ text: getMessage(MESSAGE_KEYS.DELETE_CUSTOMER_SERVICE) }]
    ])
  );
}

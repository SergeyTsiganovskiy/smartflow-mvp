function startDeleteCustomerService(chatId, settings) {
  const session = getUserSession(chatId);

  const customerId = session.customer_service_customer_id;

  if (!customerId) {
    startCustomerServices(chatId, settings);
    return;
  }

  const phone = session.customer_service_phone;

  const settingsList = getCustomerServiceSettingsByPhone(phone);

  const keyboardRows = [];

  settingsList.forEach(function (item) {
    keyboardRows.push([
      {
        text: item.service_name || item.service_id
      }
    ]);
  });

  setUserState(chatId, ADMIN_STATES.WAITING_CUSTOMER_SERVICE_TO_DELETE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_CUSTOMER_SERVICE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processCustomerServiceToDelete(chatId, text, settings) {
  const session = getUserSession(chatId);

  const phone = session.customer_service_phone;

  const settingsList = getCustomerServiceSettingsByPhone(phone);

  const selected = settingsList.find(function (item) {
    return String(item.service_name || item.service_id).trim() === String(text || '').trim();
  });

  if (!selected) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_CUSTOMER_SERVICE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  deleteCustomerServiceSettingByPhone(phone, selected.service_id);

  const profile = findCustomerProfileByPhone(phone);

  sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.CUSTOMER_SERVICE_DELETED));

  showCustomerServices(chatId, profile, settings);
}

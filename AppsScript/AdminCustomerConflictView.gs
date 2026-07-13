function startListCustomerConflicts(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_LIST_PHONE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_MAIN_PHONE),
    buildKeyboardWithMainMenu([])
  );
}

function startShowCustomerConflicts(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_LIST_PHONE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_MAIN_PHONE),
    buildKeyboardWithMainMenu([])
  );
}

function processShowCustomerConflicts(chatId, text, settings) {
  const phone = normalizePhone(text);

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

  const conflicts = getCustomerConflictsByPhone(phone);

  let message = '<b>' + getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_LIST) + '</b>\n\n';

  message += profile.name + '\n';

  message += profile.phone + '\n\n';

  if (conflicts.length === 0) {
    message += getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICTS_EMPTY);
  } else {
    conflicts.forEach(function (item, index) {
      const name = String(item.customer_name || '').trim();

      const phone = String(item.phone || '').trim();

      message += String(index + 1) + '. ' + (name || '-') + '\n';

      message += phone + '\n\n';
    });
  }

  setUserState(chatId, '');

  sendTelegramMessage(settings.AdminBotToken, chatId, message, buildKeyboardWithMainMenu([]));
}

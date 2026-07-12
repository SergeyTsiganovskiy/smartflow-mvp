function startCustomerVisitHistory(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_VISIT_HISTORY_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_CUSTOMER_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processCustomerVisitHistoryPhone(
  chatId,
  text,
  settings
) {
  const profile =
    findCustomerProfileByPhone(text);

  if (!profile) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_NOT_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    startCustomerVisitHistory(
      chatId,
      settings
    );

    return;
  }

  showCustomerVisitHistory(
    chatId,
    profile,
    settings
  );
}

function showCustomerVisitHistory(
  chatId,
  profile,
  settings
) {

  const visits =
    getCustomerVisitHistoryByPhone(
      profile.phone
    );

  setUserState(
    chatId,
    ''
  );

  if (visits.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.NO_CUSTOMER_VISITS_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(
      MESSAGE_KEYS.CUSTOMER_VISIT_HISTORY_TITLE
    ) +
    '</b>\n\n';

  text +=
    '👤 ' +
    (profile.name || '-') +
    '\n';

  text +=
    '📞 ' +
    formatPhoneForDisplay(
      profile.phone
    ) +
    '\n';

  text +=
    '📊 Всего посещений: ' +
    visits.length +
    '\n\n';

  visits.forEach(function(
    visit,
    index
  ) {
    text +=
      '#' + (index + 1) +
      '.\n';

    text +=
      '📅 ' +
      formatDateTimeForDisplay(
        visit.start_at
      ) +
      '\n';

    text +=
      '💇 ' +
      (visit.service_name || '-') +
      '\n';

    text +=
      '👩 ' +
      (visit.provider_name || '-') +
      '\n';

    text +=
      '🏢 ' +
      (visit.location_name || '-') +
      '\n';

    text +=
      (
        visit.source === 'calendar_manual'
          ? '✍️ Ручная запись'
          : '🤖 Через бот'
      ) +
      '\n\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}

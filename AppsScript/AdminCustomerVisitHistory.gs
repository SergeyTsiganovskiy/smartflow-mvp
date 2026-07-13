function startCustomerVisitHistory(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_CUSTOMER_VISIT_HISTORY_PHONE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_CUSTOMER_PHONE),
    buildKeyboardWithMainMenu([])
  );
}

function processCustomerVisitHistoryPhone(chatId, text, settings) {
  const profile = findCustomerProfileByPhone(text);

  if (!profile) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND),
      buildKeyboardWithMainMenu([])
    );

    startCustomerVisitHistory(chatId, settings);

    return;
  }

  setUserSessionValues(chatId, {
    customer_visit_history_phone: profile.phone,
    customer_visit_history_page: 1
  });

  showCustomerVisitHistory(chatId, profile, settings, 1);
}

function showCustomerVisitHistory(chatId, profile, settings, page) {
  page = Math.max(1, Number(page || 1));

  const visits = getCustomerVisitHistoryByPhone(profile.phone);

  setUserState(chatId, '');

  if (visits.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_CUSTOMER_VISITS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const pageSize = getPaginationPageSize(settings);

  const totalPages = Math.ceil(visits.length / pageSize);
  page = Math.min(page, totalPages);

  setUserSessionValue(chatId, 'customer_visit_history_page', page);

  const startIndex = (page - 1) * pageSize;
  const pageVisits = visits.slice(startIndex, startIndex + pageSize);

  let text =
    '<b>' + getMessage(MESSAGE_KEYS.CUSTOMER_VISIT_HISTORY_TITLE) + '</b>\n' + '(' + page + '/' + totalPages + ')\n\n';

  text += '👤 ' + (profile.name || '-') + '\n';

  text += '📞 ' + formatPhoneForDisplay(profile.phone) + '\n';

  text += '📊 Всего посещений: ' + visits.length + '\n\n';

  pageVisits.forEach(function (visit, index) {
    text += '#' + (startIndex + index + 1) + '.\n';

    text += '📅 ' + formatDateTimeForDisplay(visit.start_at) + '\n';

    text += '💇 ' + (visit.service_name || '-') + '\n';

    text += '👩 ' + (visit.provider_name || '-') + '\n';

    text += '🏢 ' + (visit.location_name || '-') + '\n';

    text += (visit.source === 'calendar_manual' ? '✍️ Ручная запись' : '🤖 Через бот') + '\n\n';
  });

  sendTelegramMessage(settings.AdminBotToken, chatId, text, buildCustomerListKeyboard(page, totalPages));
}

function showCustomerVisitHistoryPage(chatId, settings, page) {
  const session = getUserSession(chatId) || {};
  const phone = String(session.customer_visit_history_phone || '').trim();
  const profile = phone ? findCustomerProfileByPhone(phone) : null;

  if (!profile) {
    startCustomerVisitHistory(chatId, settings);
    return;
  }

  showCustomerVisitHistory(chatId, profile, settings, page);
}

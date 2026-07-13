function startCustomerProfilesList(chatId, settings) {
  setUserSessionValues(chatId, {
    customer_visit_history_phone: '',
    customer_visit_history_page: ''
  });

  setUserSessionValue(chatId, 'customer_list_page', 1);

  showCustomerProfilesList(chatId, settings, 1);
}

function showCustomerProfilesList(chatId, settings, page) {
  page = page || 1;

  const profiles = getCustomerProfiles().filter(function (profile) {
    return String(profile.active).toUpperCase() === 'TRUE' || profile.active === true;
  });

  if (profiles.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_CUSTOMER_PROFILES_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  profiles.sort(function (a, b) {
    return String(a.name || '').localeCompare(String(b.name || ''));
  });

  const pageSize = getPaginationPageSize(settings);

  const totalPages = Math.ceil(profiles.length / pageSize);

  const startIndex = (page - 1) * pageSize;

  const endIndex = startIndex + pageSize;

  const pageProfiles = profiles.slice(startIndex, endIndex);

  let text = '<b>' + getMessage(MESSAGE_KEYS.CUSTOMER_PROFILES_LIST_TITLE) + '</b>\n';

  text += '(' + page + '/' + totalPages + ')\n\n';

  pageProfiles.forEach(function (profile, index) {
    text += startIndex + index + 1 + '. 👤 ' + (profile.name || '-') + '\n';

    text += '   📞 ' + formatPhoneForDisplay(profile.phone) + '\n\n';
  });

  sendTelegramMessage(settings.AdminBotToken, chatId, text, buildCustomerListKeyboard(page, totalPages));
}

function buildCustomerListKeyboard(page, totalPages) {
  const rows = [];

  const navigationRow = [];

  if (page > 1) {
    navigationRow.push({
      text: getMessage(MESSAGE_KEYS.CUSTOMER_LIST_PREVIOUS)
    });
  }

  if (page < totalPages) {
    navigationRow.push({
      text: getMessage(MESSAGE_KEYS.CUSTOMER_LIST_NEXT)
    });
  }

  if (navigationRow.length > 0) {
    rows.push(navigationRow);
  }

  return buildKeyboardWithMainMenu(rows);
}

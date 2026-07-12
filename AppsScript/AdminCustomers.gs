
function sendCustomersMenu(
  chatId,
  settings
) {

  navigateAdmin(chatId, ADMIN_MENUS.CUSTOMERS);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_CUSTOMERS),
    buildCustomersMenuKeyboard()
  );
}

function buildCustomersMenuKeyboard() {
  return buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILES_LIST)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_CREATE)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_DELETE)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICTS_MENU)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_VISIT_HISTORY)
      }
    ],
  ]);
}

function startCustomerProfile(
  chatId,
  settings
) {
  navigateAdmin(
    chatId,
    ADMIN_MENUS.CUSTOMERS,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_CUSTOMER_PHONE),
    buildKeyboardWithMainMenu([])
  );
}

function processCustomerProfilePhone(
  chatId,
  text,
  settings
) {
  const profile =
    findCustomerProfileByPhone(text);

  if (!profile || profile.active === false) {
    setUserState(
      chatId,
      ADMIN_STATES.WAITING_CUSTOMER_PROFILE_PHONE
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND) +
        '\n\n' +
        getMessage(MESSAGE_KEYS.ENTER_CUSTOMER_PHONE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserState(chatId, '');

  showCustomerProfile(
    chatId,
    settings,
    profile
  );
}

function showCustomerProfile(
  chatId,
  settings,
  profile
) {
  const nextAppointment =
    getNextCustomerAppointment(
      profile.phone
    );

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_TITLE) +
    '</b>\n\n';

  text +=
    '<b>Основная информация</b>\n';

  text +=
    '👤 Имя: ' +
    (profile.name || '-') +
    '\n';

  text +=
    '📞 Телефон: ' +
    formatPhoneForDisplay(
      profile.phone
    ) +
    '\n\n';

  text +=
    '<b>Записи и визиты</b>\n';

  text +=
    '📅 Последний визит: ' +
    (
      profile.last_visit_at
        ? formatDateTimeForDisplay(
            profile.last_visit_at
          )
        : '-'
    ) +
    '\n';

  text +=
    '🔢 Всего визитов: ' +
    (profile.visit_count || 0) +
    '\n\n';

  text +=
    '<b>Следующая запись</b>\n';

  if (nextAppointment) {
    text +=
      '🕒 ' +
      formatDateTimeForDisplay(
        nextAppointment.start_at
      ) +
      '\n';

    text +=
      '💇 ' +
      (nextAppointment.service_name || '-') +
      '\n';

    text +=
      '👩 ' +
      (nextAppointment.provider_name || '-') +
      '\n';

    text +=
      '🏢 ' +
      (nextAppointment.location_name || '-') +
      '\n\n';
  } else {
    text +=
      'Записей нет\n\n';
  }

  text +=
    '<b>Информация для мастера</b>\n';

  text +=
    '🛍 Подсказка продажи: ' +
    (profile.sales_hint || '-') +
    '\n';

  text +=
    '📝 Заметка: ' +
    (profile.note || '-') +
    '\n';

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}

function startEditCustomerProfile(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_PHONE
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

function processEditCustomerProfilePhone(
  chatId,
  text,
  settings
) {
  const profile =
    findCustomerProfileByPhone(text);

  if (!profile || profile.active === false) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_NOT_FOUND
      ) +
        '\n\n' +
        getMessage(
          MESSAGE_KEYS.ENTER_CUSTOMER_PHONE
        ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'customer_profile_id',
    profile.profile_id
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_FIELD
  );

  showCustomerProfileEditFieldMenu(
    chatId,
    settings,
    profile
  );
}

function showCustomerProfileEditFieldMenu(
  chatId,
  settings,
  profile
) {
  let text =
    '<b>' +
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_TITLE
    ) +
    '</b>\n\n';

  text +=
    '<b>Основная информация</b>\n';

  text +=
    '👤 Имя: ' +
    (profile.name || '-') +
    '\n';

  text +=
    '📞 Телефон: ' +
    (profile.phone || '-') +
    '\n\n';

  text +=
    '<b>Визиты</b>\n';

  text +=
    '📅 Последняя запись: ' +
    (
      profile.last_visit_at
        ? formatDateTimeForDisplay(
            profile.last_visit_at
          )
        : '-'
    ) +
    '\n';

  text +=
    '🔢 Всего записей: ' +
    (profile.visit_count || 0) +
    '\n\n';

  text +=
    '<b>Информация для мастера</b>\n';

  text +=
    '🛍 Подсказка продажи: ' +
    (profile.sales_hint || '-') +
    '\n';

  text +=
    '📝 Заметка: ' +
    (profile.note || '-') +
    '\n\n';

  text +=
    '<b>' +
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_FIELD
    ) +
    '</b>';

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildCustomerProfileEditFieldKeyboard()
  );
}

function buildCustomerProfileEditFieldKeyboard() {
  return buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(
          MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_NAME
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_SALES_HINT
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_NOTE
        )
      }
    ]
  ]);
}

function processEditCustomerProfileField(
  chatId,
  text,
  settings
) {
  let field = '';

  if (
    text ===
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_NAME
    )
  ) {
    field = 'name';
  }

  if (
    text ===
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_SALES_HINT
    )
  ) {
    field = 'sales_hint';
  }

  if (
    text ===
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_NOTE
    )
  ) {
    field = 'note';
  }

  if (!field) {
    return;
  }

  setUserSessionValue(
    chatId,
    'customer_profile_field',
    field
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_VALUE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_ENTER_NEW_VALUE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processEditCustomerProfileValue(
  chatId,
  text,
  settings
) {
  const session =
    getUserSession(chatId);

  const profileId =
    session.customer_profile_id;

  const field =
    session.customer_profile_field;

  if (!profileId || !field) {
    setUserState(chatId, '');

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_NOT_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const updates = {};

  updates[field] = text;

  const updated =
    updateCustomerProfile(
      profileId,
      updates
    );

  setUserState(chatId, '');

  if (!updated) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_NOT_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_UPDATED
    ),
    buildKeyboardWithMainMenu([])
  );
}

function startCustomerProfilesList(
  chatId,
  settings
) {
  setUserSessionValue(
    chatId,
    'customer_list_page',
    1
  );

  showCustomerProfilesList(
    chatId,
    settings,
    1
  );
}

function showCustomerProfilesList(
  chatId,
  settings,
  page
) {
  page = page || 1;

  const profiles =
    getCustomerProfiles()
      .filter(function(profile) {
        return (
          String(profile.active).toUpperCase() === 'TRUE' ||
          profile.active === true
        );
      });

  if (profiles.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.NO_CUSTOMER_PROFILES_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  profiles.sort(function(a, b) {
    return String(
      a.name || ''
    ).localeCompare(
      String(
        b.name || ''
      )
    );
  });

  const totalPages =
    Math.ceil(
      profiles.length /
      CUSTOMER_LIST_PAGE_SIZE
    );

  const startIndex =
    (page - 1) *
    CUSTOMER_LIST_PAGE_SIZE;

  const endIndex =
    startIndex +
    CUSTOMER_LIST_PAGE_SIZE;

  const pageProfiles =
    profiles.slice(
      startIndex,
      endIndex
    );

  let text =
    '<b>' +
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILES_LIST_TITLE
    ) +
    '</b>\n';

  text +=
    '(' +
    page +
    '/' +
    totalPages +
    ')\n\n';

  pageProfiles.forEach(function(
    profile,
    index
  ) {
    text +=
      (
        startIndex +
        index +
        1
      ) +
      '. 👤 ' +
      (
        profile.name ||
        '-'
      ) +
      '\n';

    text +=
      '   📞 ' +
      formatPhoneForDisplay(
        profile.phone
      ) +
      '\n\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildCustomerListKeyboard(
      page,
      totalPages
    )
  );
}

function buildCustomerListKeyboard(
  page,
  totalPages
) {
  const rows = [];

  const navigationRow = [];

  if (page > 1) {
    navigationRow.push({
      text: getMessage(
        MESSAGE_KEYS.CUSTOMER_LIST_PREVIOUS
      )
    });
  }

  if (page < totalPages) {
    navigationRow.push({
      text: getMessage(
        MESSAGE_KEYS.CUSTOMER_LIST_NEXT
      )
    });
  }

  if (navigationRow.length > 0) {
    rows.push(navigationRow);
  }

  return buildKeyboardWithMainMenu(rows);
}

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

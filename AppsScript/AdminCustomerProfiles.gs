function startCreateCustomerProfile(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_CREATE_PHONE
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

function processCreateCustomerProfilePhone(
  chatId,
  text,
  settings
) {
  const profile =
    findCustomerProfileByPhone(text);

  if (profile) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_PROFILE_ALREADY_EXISTS
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
    'new_customer_phone',
    normalizePhone(text)
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_CREATE_NAME
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_ENTER_NAME
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processCreateCustomerProfileName(
  chatId,
  text,
  settings
) {
  const session =
    getUserSession(chatId) || {};

  const phone =
    session.new_customer_phone;

  if (!phone) {
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

  createCustomerProfile({
    phone: phone,
    name: text
  });

  setUserSessionValue(
    chatId,
    'new_customer_phone',
    ''
  );

  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_CREATED
    ),
    buildKeyboardWithMainMenu([])
  );
}

function startDeleteCustomerProfile(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_DELETE_PHONE
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

function processDeleteCustomerProfilePhone(
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

  deactivateCustomerProfile(
    profile.profile_id
  );

  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_DELETED
    ),
    buildKeyboardWithMainMenu([])
  );
}

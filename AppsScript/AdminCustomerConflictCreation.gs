function startAddCustomerConflict(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_MAIN_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_MAIN_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processCustomerConflictMainPhone(
  chatId,
  text,
  settings
) {
  const phone =
    normalizePhone(text);

  const profile =
    findCustomerProfileByPhone(phone);

  if (!profile || profile.active === false) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValues(
    chatId,
    {
      conflict_main_phone: profile.phone,
      conflict_main_phone_key: profile.phone_key,
      conflict_main_customer_name: profile.name
    }
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_CONFLICT_PHONE
    ),
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(
            MESSAGE_KEYS.CUSTOMER_CONFLICTS_DONE
          )
        }
      ]
    ])
  );
}

function processCustomerConflictPhone(
  chatId,
  text,
  settings
) {
  if (
    text ===
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICTS_DONE
    )
  ) {
    startCustomerConflicts(
      chatId,
      settings
    );

    return;
  }

  const phone =
    normalizePhone(text);

  const phoneKey =
    getPhoneSearchKey(phone);

  const profile =
    findCustomerProfileByPhone(phone);

  const session =
    getUserSession(chatId);

  if (
    phoneKey ===
    String(session.conflict_main_phone_key)
  ) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_SELF_NOT_ALLOWED),
      buildConflictAddKeyboard()
    );

    return;
  }

  const created =
    createCustomerConflict({
      phone:
        session.conflict_main_phone,

      phone_key:
        session.conflict_main_phone_key,

      customer_name:
        session.conflict_main_customer_name,

      conflict_phone:
        phone,

      conflict_phone_key:
        phoneKey,

      conflict_customer_name:
        profile && profile.active !== false
          ? profile.name || ''
          : ''
    });

  if (!created) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_CONFLICT_ALREADY_EXISTS
      ),
      buildConflictAddKeyboard()
    );

    return;
  }

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_ADDED
    ) +
      '\n\n' +
      getMessage(
        MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_CONFLICT_PHONE
      ),
    buildConflictAddKeyboard()
  );
}

function buildConflictAddKeyboard() {
  return buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(
          MESSAGE_KEYS.CUSTOMER_CONFLICTS_DONE
        )
      }
    ]
  ]);
}

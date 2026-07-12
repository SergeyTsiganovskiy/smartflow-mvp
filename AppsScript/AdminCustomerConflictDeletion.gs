function startDeleteCustomerConflict(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_DELETE_MAIN_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_DELETE_MAIN_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processDeleteCustomerConflictMainPhone(
  chatId,
  text,
  settings
) {
  const phone =
    normalizePhone(text);

  const profile =
    findCustomerProfileByPhone(phone);

  if (
    !profile ||
    profile.active === false
  ) {
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

  setUserSessionValues(
    chatId,
    {
      delete_conflict_main_phone:
        profile.phone,

      delete_conflict_main_phone_key:
        profile.phone_key,

      delete_conflict_main_customer_name:
        profile.name
    }
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_DELETE_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_ENTER_DELETE_PHONE
    ),
    buildConflictAddKeyboard()
  );
}

function processDeleteCustomerConflictPhone(
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

  const session =
    getUserSession(chatId);

  const deleted =
    deactivateCustomerConflict(
      session.delete_conflict_main_phone_key,
      getPhoneSearchKey(phone)
    );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    deleted
      ? getMessage(
          MESSAGE_KEYS.CUSTOMER_CONFLICT_DELETED
        )
      : getMessage(
          MESSAGE_KEYS.CUSTOMER_CONFLICT_NOT_FOUND
        ),
    buildConflictAddKeyboard()
  );
}

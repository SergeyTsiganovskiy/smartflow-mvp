
function startProviderOverrides(
  chatId,
  settings
) {

  setPreviousMenu(chatId, 'PROVIDERS_MENU');

  const providers =
    getProviders();

  const keyboardRows = [];

  providers.forEach(function(provider) {
    keyboardRows.push([
      {
        text: provider.name
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_FOR_OVERRIDE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_PROVIDER_FOR_OVERRIDE
    ),
    buildKeyboardWithMainMenu(
      keyboardRows
    )
  );
}

function processProviderForOverride(
  chatId,
  text,
  settings
) {
  const provider =
    findProviderByName(text);

  if (!provider) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.SELECT_PROVIDER_FROM_LIST
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'override_provider_id',
    provider.id
  );

  showOverrideActions(
    chatId,
    settings
  );
}

function showOverrideActions(
  chatId,
  settings
) {
  setPreviousMenu(
    chatId,
    'OVERRIDE_PROVIDERS_LIST'
  );

  const session =
    getUserSession(chatId);

  const providerId =
    session.override_provider_id;

  const provider =
    findProviderById(providerId);

  const overrides =
    getProviderOverrides(providerId);

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_OVERRIDES) +
    '</b>\n\n';

  if (provider) {
    text += provider.name + '\n\n';
  }

  if (overrides.length === 0) {
    text +=
      getMessage(MESSAGE_KEYS.NO_OVERRIDES_FOUND) +
      '\n\n';
  } else {
    overrides.forEach(function(item) {
      text +=
        formatDateForDisplay(item.date) +
        ' — ' +
        getMessage(item.reason_key);

      if (String(item.is_working).toUpperCase() === 'TRUE') {
        text +=
          ' ' +
          formatScheduleTime(item.start_time) +
          '-' +
          formatScheduleTime(item.end_time);
      }

      text += '\n';
    });

    text += '\n';
  }

  const keyboard =
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(MESSAGE_KEYS.ADD_OVERRIDE)
        }
      ],
      [
        {
          text: getMessage(MESSAGE_KEYS.DELETE_OVERRIDE)
        }
      ]
    ]);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_OVERRIDE_ACTION
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    keyboard
  );
}

function processOverrideAction(
  chatId,
  text,
  settings
) {
  if (
    text ===
    getMessage(
      MESSAGE_KEYS.ADD_OVERRIDE
    )
  ) {
    showOverrideReasons(
      chatId,
      settings
    );

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.DELETE_OVERRIDE)) {
    startDeleteOverride(chatId, settings);
    return;
  }
}

function showOverrideReasons(
  chatId,
  settings
) {
  const keyboard =
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(
            MESSAGE_KEYS.REASON_VACATION
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.REASON_SICK_LEAVE
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.REASON_DAY_OFF
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.REASON_SHORT_DAY
          )
        }
      ]
    ]);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_OVERRIDE_REASON
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_REASON
    ),
    keyboard
  );
}

function showOverridesList(
  chatId,
  settings
) {
  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    'TODO'
  );
}

function processOverrideReason(
  chatId,
  text,
  settings
) {
  const reasons = {};

  reasons[
    getMessage(
      MESSAGE_KEYS.REASON_VACATION
    )
  ] = 'REASON_VACATION';

  reasons[
    getMessage(
      MESSAGE_KEYS.REASON_SICK_LEAVE
    )
  ] = 'REASON_SICK_LEAVE';

  reasons[
    getMessage(
      MESSAGE_KEYS.REASON_DAY_OFF
    )
  ] = 'REASON_DAY_OFF';

  reasons[
    getMessage(
      MESSAGE_KEYS.REASON_SHORT_DAY
    )
  ] = 'REASON_SHORT_DAY';

  const reasonKey =
    reasons[text];

  if (!reasonKey) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.SELECT_REASON
      )
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'override_reason_key',
    reasonKey
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_OVERRIDE_DATE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_OVERRIDE_DATE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processOverrideDate(chatId, text, settings) {
  const dateValue = String(text || '').trim();

  if (!isValidDateValue(dateValue)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.INVALID_DATE_FORMAT),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'override_date',
    dateValue
  );

  const session =
    getUserSession(chatId);

  if (session.override_reason_key === 'REASON_SHORT_DAY') {
    setUserState(
      chatId,
      ADMIN_STATES.WAITING_OVERRIDE_START_TIME
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_START),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  createProviderScheduleOverrideFromSession(
    chatId
  );

  clearUserSession(chatId);
  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.OVERRIDE_CREATED),
    buildKeyboardWithMainMenu([])
  );
}

function processOverrideStartTime(
  chatId,
  text,
  settings
) {
  const value =
    normalizeTimeValue(text);

  if (!isValidTimeValue(value)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.INVALID_TIME_FORMAT
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'override_start_time',
    value
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_OVERRIDE_END_TIME
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SCHEDULE_ACTION_END
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processOverrideEndTime(
  chatId,
  text,
  settings
) {
  const value =
    normalizeTimeValue(text);

  if (!isValidTimeValue(value)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.INVALID_TIME_FORMAT
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const session =
    getUserSession(chatId);

  const startMinutes =
    timeValueToMinutes(
      session.override_start_time
    );

  const endMinutes =
    timeValueToMinutes(value);

  if (
    startMinutes === null ||
    endMinutes === null ||
    startMinutes >= endMinutes
  ) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.INVALID_TIME_RANGE
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'override_end_time',
    value
  );

  createShortDayOverride(
    chatId
  );

  clearUserSession(chatId);

  setUserState(
    chatId,
    ''
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.OVERRIDE_CREATED
    )
  );
}

function startDeleteOverride(chatId, settings) {
  const session = getUserSession(chatId);
  const providerId = session.override_provider_id;

  const overrides = getProviderOverrides(providerId);
  const keyboardRows = [];

  overrides.forEach(function(item, index) {
    keyboardRows.push([
      {
        text: buildOverrideLabel(item, index)
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_OVERRIDE_TO_DELETE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_OVERRIDE_TO_DELETE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processOverrideToDelete(chatId, text, settings) {
  const session = getUserSession(chatId);
  const providerId = session.override_provider_id;

  const overrides = getProviderOverrides(providerId);

  const selectedOverride = overrides.find(function(item, index) {
    return buildOverrideLabel(item, index) === String(text || '').trim();
  });

  if (!selectedOverride) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_OVERRIDE_TO_DELETE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  disableProviderOverride(selectedOverride.override_id);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.OVERRIDE_DELETED)
  );

  showOverrideActions(chatId, settings);
}

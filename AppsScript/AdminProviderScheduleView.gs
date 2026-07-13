function startProviderSchedule(chatId, settings) {
  setPreviousMenu(chatId, 'PROVIDERS_MENU');

  const providers = getProviders();
  const keyboardRows = [];

  providers.forEach(function (provider) {
    keyboardRows.push([
      {
        text: provider.name
      }
    ]);
  });

  setUserState(chatId, ADMIN_STATES.WAITING_PROVIDER_FOR_SCHEDULE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FOR_SCHEDULE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processProviderForSchedule(chatId, text, settings) {
  const provider = findProviderByName(text);

  if (!provider) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FROM_LIST),
      buildProvidersMenuKeyboard()
    );
    return;
  }

  setUserSessionValue(chatId, 'schedule_provider_id', provider.id);

  showProviderScheduleAdmin(chatId, provider.id, settings);
}

function showProviderScheduleAdmin(chatId, providerId, settings) {
  const provider = findProviderById(providerId);

  const schedule = getProviderSchedule(providerId);

  let text = '<b>' + getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_SCHEDULE) + '</b>\n\n';

  text += provider.name + '\n\n';

  schedule.forEach(function (item) {
    const day = getWeekDayByCode(item.day_of_week);

    const dayName = day ? getMessage(day.message_key) : item.day_of_week;

    text += '<b>' + dayName + '</b> ';

    if (String(item.is_working).toUpperCase() === 'TRUE') {
      text += formatScheduleTime(item.start_time) + '-' + formatScheduleTime(item.end_time) + '\n';
    } else {
      text += getMessage(MESSAGE_KEYS.DAY_OFF) + '\n';
    }
  });

  setUserState(chatId, ADMIN_STATES.WAITING_SCHEDULE_DAY);

  sendTelegramMessage(settings.AdminBotToken, chatId, text, buildScheduleDaysKeyboard());
}

function buildScheduleDaysKeyboard() {
  const weekDays = getWeekDays();
  const keyboardRows = [];

  weekDays.forEach(function (day) {
    keyboardRows.push([
      {
        text: getMessage(day.message_key)
      }
    ]);
  });

  return buildKeyboardWithMainMenu(keyboardRows);
}

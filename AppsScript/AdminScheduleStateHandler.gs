function handleAdminScheduleState(chatId, text, state, settings) {
  if (state === ADMIN_STATES.WAITING_PROVIDER_FOR_SCHEDULE) {
    processProviderForSchedule(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SCHEDULE_DAY) {
    processScheduleDay(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SCHEDULE_ACTION) {
    processScheduleAction(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SCHEDULE_START_TIME) {
    processScheduleStartTime(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SCHEDULE_END_TIME) {
    processScheduleEndTime(chatId, text, settings);
    return;
  }
}

function doPost(e) {
  try {
    const update =
      JSON.parse(e.postData.contents);

    addAuditLog(
      'DOPOST_ADMIN_DEBUG',
      JSON.stringify({
        parameters: e.parameter,
        body: e.postData.contents
      })
    );

    const botType =
      e.parameter && e.parameter.bot
        ? e.parameter.bot
        : 'client';

    if (
      update.update_id &&
      isDuplicateTelegramUpdate(
        update.update_id,
        botType.toUpperCase()
      )
    ) {
      addAuditLog(
        'DUPLICATE_UPDATE_SKIPPED',
        JSON.stringify({
          botType: botType,
          updateId: update.update_id
        })
      );

      return HtmlService.createHtmlOutput('OK');
    }

    if (botType === 'admin') {
      if (update.message) {
        handleAdminMessage(update.message);
      }

      if (update.callback_query) {
        handleAdminCallback(update.callback_query);
      }

      return HtmlService.createHtmlOutput('OK');
    }

    if (update.message) {
      handleClientMessage(update.message);
    }

    if (update.callback_query) {
      handleOwnerCallback(update.callback_query);
    }

    return HtmlService.createHtmlOutput('OK');

  } catch (error) {
    addAuditLog(
      'DOPOST_ERROR',
      String(error)
    );

    return HtmlService.createHtmlOutput('ERROR');
  }
}

function handleAdminCallback(callbackQuery) {
  addAuditLog(
    'ADMIN_CALLBACK',
    JSON.stringify(callbackQuery)
  );
}

function testMessages() {
  const text = getMessage('START');
  Logger.log(text);
}

function testSendTelegram() {
  const settings = getSettings();

  sendTelegramMessage(
    settings.ClientBotToken,
    settings.OwnerTelegramId,
    'SmartFlow test successful ✅'
  );
}

function testSendToOwner() {
  const settings = getSettings();

  sendTelegramMessage(
    settings.ClientBotToken,
    settings.OwnerTelegramId,
    'Manual test from current project ✅'
  );
}

function testSelectPeriodMessage() {
  Logger.log(MESSAGE_KEYS.SELECT_PERIOD);
  Logger.log(getMessage(MESSAGE_KEYS.SELECT_PERIOD));
}

function testAvailableSlotsWithSchedule() {
  const slots = getAvailableTimeSlots(
    'prov_003',
    '2026-06-16',
    180
  );

  Logger.log(slots);
}

function testAvailabilityExact() {
  const providerId = 'prov_001';
  const date = '2026-06-22';
  const durationMinutes = getDefaultServiceDurationMinutes('serv_002');

  Logger.log('duration=' + durationMinutes);

  const dayCode = getDayOfWeekCode(date);
  Logger.log('dayCode=' + dayCode);

  const schedule = getProviderScheduleForDate(providerId, date);
  Logger.log('schedule=' + JSON.stringify(schedule));

  const appointments = getProviderAppointmentsForDate(providerId, date);
  Logger.log('appointments=' + JSON.stringify(appointments));

  const slots = getAvailableTimeSlots(providerId, date, durationMinutes);
  Logger.log('slots=' + JSON.stringify(slots));
}

function testCalendarBusy() {
  const busy = getCalendarBusyIntervals(
    'prov_003',
    '2026-06-13'
  );

  Logger.log(JSON.stringify(busy));
}

function testFindAppointmentsByPhone() {
  const phone = '380664452124';

  Logger.log('searchKey=' + getPhoneSearchKey(phone));

  const appointments = getActiveAppointmentsByPhone(phone);

  Logger.log(JSON.stringify(appointments));
}

function testActiveRequestRecipients() {
  Logger.log(
    JSON.stringify(
      getActiveRequestRecipients()
    )
  );
}

function testConflictAppointments() {
  const customerIds =
    getConflictingCustomerIds('cust_001');

  const result =
    getAppointmentsForCustomersOnDate(
      customerIds,
      new Date('2026-06-16')
    );

  Logger.log(
    JSON.stringify(result)
  );
}

function testGeneral() {
  setUserSessionValue(
    726107007,
    'test_field',
    'hello'
  );
}

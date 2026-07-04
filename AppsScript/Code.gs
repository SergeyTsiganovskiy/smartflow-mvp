function doPost(e) {
  try {
    const update =
      JSON.parse(e.postData.contents);

/*    addAuditLog(
      'DOPOST_ADMIN_DEBUG',
      JSON.stringify({
        parameters: e.parameter,
        body: e.postData.contents
      })
    );
*/

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

function testGeneral() {
  clearCalendarCacheForDate('2026-06-23');
  syncCalendarCacheForDate('2026-06-23')
}

function testAppointmentsMenuMessages() {
  const keys = [
    'ADMIN_APPOINTMENTS',
    'ADMIN_APPOINTMENTS_TODAY',
    'ADMIN_APPOINTMENTS_BY_PROVIDER',
    'ADMIN_APPOINTMENTS_BY_DATE',
    'SELECT_PROVIDER_FOR_APPOINTMENTS',
    'APPOINTMENTS_BY_PROVIDER_TITLE',
    'SELECT_APPOINTMENT_DATE',
    'APPOINTMENTS_BY_DATE_TITLE'
  ];

  keys.forEach(key => {
    const value = getMessage(MESSAGE_KEYS[key]);

    Logger.log(
      key + ' = ' + (value || '❌ NOT FOUND')
    );
  });
}

function testAppointmentsMenuKeyboard() {
  const keyboard =
    buildAppointmentsMenuKeyboard();

  Logger.log(
    JSON.stringify(
      keyboard,
      null,
      2
    )
  );
}

function testAppointmentsMenuKeyboard1() {
  const keyboard =
    buildAppointmentsMenuKeyboard();

  Logger.log('=== APPOINTMENTS MENU ===');

  keyboard.keyboard.forEach((row, rowIndex) => {
    row.forEach((button, buttonIndex) => {
      Logger.log(
        'Row ' +
          rowIndex +
          ', Button ' +
          buttonIndex +
          ': ' +
          (button.text || '❌ EMPTY')
      );
    });
  });

  Logger.log(
    JSON.stringify(
      keyboard,
      null,
      2
    )
  );
}

function testCustomerProfiles() {
  const profile =
    createCustomerProfile({
      phone: '+380501112233',
      name: 'Тест',
      active: true
    });

  Logger.log(profile);

  updateCustomerProfile(
    profile.profile_id,
    {
      sales_hint:
        'Хочу заказать уход'
    }
  );

  Logger.log(
    findCustomerProfileByPhone(
      '+380501112233'
    )
  );
}

function testSyncCustomerProfiles() {
  syncCustomerProfiles();
}

function testSyncYesterdayVisitHistory() {
  const settings =
    getSettings();

  const timezone =
    settings.TimeZone || 'Europe/Kyiv';

  const yesterday =
    new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  const dateString =
    Utilities.formatDate(
      yesterday,
      timezone,
      'yyyy-MM-dd'
    );

  syncCalendarCacheForDate(
    dateString
  );

  syncCustomerVisitHistoryFromCalendarCache();

  syncCustomerProfiles();

  Logger.log(
    'DONE: ' + dateString
  );
}

function testSyncCalendarCache() {
  //syncCalendarCacheLongRangeTrigger();
  syncCalendarCacheNearDatesTrigger();
}

function testDeletedAppointmentEvent() {
  const appointment =
    getAppointmentById(
      'appt_1782736987763'
    );

  const event =
    getCalendarEventByAppointment(
      appointment
    );

  if (!event) {
    Logger.log('EVENT NOT FOUND');
    return;
  }

  Logger.log(
    JSON.stringify({
      id: event.getId(),
      title: event.getTitle(),
      start: event.getStartTime(),
      end: event.getEndTime(),
      description: event.getDescription()
    })
  );
}

function testProviderCalendarId() {
  const calendarId =
    getProviderCalendarId('prov_001');

  const calendar =
    CalendarApp.getCalendarById(calendarId);

  Logger.log(
    JSON.stringify({
      provider_id: 'prov_001',
      calendar_id: calendarId,
      calendar_name: calendar ? calendar.getName() : ''
    })
  );
}

function testProviderEventsForDate() {
  const calendarId =
    getProviderCalendarId('prov_001');

  const calendar =
    CalendarApp.getCalendarById(calendarId);

  const start =
    new Date('2026-06-30T00:00:00');

  const end =
    new Date('2026-06-30T23:59:59');

  const events =
    calendar.getEvents(start, end);

  events.forEach(function(event) {
    Logger.log(
      JSON.stringify({
        id: event.getId(),
        title: event.getTitle(),
        start: event.getStartTime(),
        end: event.getEndTime(),
        description: event.getDescription()
      })
    );
  });
}

function testManualCalendarDuplicationRows() {
syncCalendarCacheForDate('2026-07-01');
}

function testSyncManualDate() {
  syncCalendarCacheForDate(
    '2026-07-04'
  );
}

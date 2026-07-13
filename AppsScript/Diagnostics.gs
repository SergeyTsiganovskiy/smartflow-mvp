function testMessages() {
  const text = getMessage('START');
  Logger.log(text);
}

function testSendAdminNotification() {
  sendAdminNotification('SmartFlow admin notification test successful ✅');
}

function testSelectPeriodMessage() {
  Logger.log(MESSAGE_KEYS.SELECT_PERIOD);
  Logger.log(getMessage(MESSAGE_KEYS.SELECT_PERIOD));
}

function testAvailableSlotsWithSchedule() {
  const slots = getAvailableTimeSlots('prov_003', '2026-06-16', 180);

  Logger.log(slots);
}

function testCalendarBusy() {
  const busy = getCalendarBusyIntervals('prov_003', '2026-06-13');

  Logger.log(JSON.stringify(busy));
}

function testFindAppointmentsByPhone() {
  const phone = '380664452124';

  Logger.log('searchKey=' + getPhoneSearchKey(phone));

  const appointments = getActiveAppointmentsByPhone(phone);

  Logger.log(JSON.stringify(appointments));
}

function testActiveRequestRecipients() {
  Logger.log(JSON.stringify(getActiveRequestRecipients()));
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

  keys.forEach((key) => {
    const value = getMessage(MESSAGE_KEYS[key]);

    Logger.log(key + ' = ' + (value || '❌ NOT FOUND'));
  });
}

function testAppointmentsMenuKeyboard() {
  const keyboard = buildAppointmentsMenuKeyboard();

  Logger.log(JSON.stringify(keyboard, null, 2));
}

function testAppointmentsMenuKeyboard1() {
  const keyboard = buildAppointmentsMenuKeyboard();

  Logger.log('=== APPOINTMENTS MENU ===');

  keyboard.keyboard.forEach((row, rowIndex) => {
    row.forEach((button, buttonIndex) => {
      Logger.log('Row ' + rowIndex + ', Button ' + buttonIndex + ': ' + (button.text || '❌ EMPTY'));
    });
  });

  Logger.log(JSON.stringify(keyboard, null, 2));
}

function testCustomerProfiles() {
  const profile = createCustomerProfile({
    phone: '+380501112233',
    name: 'Тест',
    active: true
  });

  Logger.log(profile);

  updateCustomerProfile(profile.profile_id, {
    sales_hint: 'Хочу заказать уход'
  });

  Logger.log(findCustomerProfileByPhone('+380501112233'));
}

function testSyncCustomerProfiles() {
  syncCustomerProfiles();
}

function testSyncCompletedCustomerVisits() {
  syncCompletedCustomerVisitsTrigger();
}

function testDeletedAppointmentEvent() {
  const appointment = getAppointmentById('appt_1782736987763');

  const event = getCalendarEventByAppointment(appointment);

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
  const calendarId = getProviderCalendarId('prov_001');

  const calendar = CalendarApp.getCalendarById(calendarId);

  Logger.log(
    JSON.stringify({
      provider_id: 'prov_001',
      calendar_id: calendarId,
      calendar_name: calendar ? calendar.getName() : ''
    })
  );
}

function testProviderEventsForDate() {
  const calendarId = getProviderCalendarId('prov_001');

  const calendar = CalendarApp.getCalendarById(calendarId);

  const start = new Date('2026-06-30T00:00:00');

  const end = new Date('2026-06-30T23:59:59');

  const events = calendar.getEvents(start, end);

  events.forEach(function (event) {
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

function testSendConfirmButton() {
  //send24hAppointmentReminders();
}

function checkAdminWebhook() {
  const settings = getSettings();

  const url = 'https://api.telegram.org/bot' + settings.AdminBotToken + '/getWebhookInfo';

  Logger.log(UrlFetchApp.fetch(url).getContentText());
}

function checkAdminBotIdentity() {
  const settings = getSettings();

  const url = 'https://api.telegram.org/bot' + settings.AdminBotToken + '/getMe';

  Logger.log(UrlFetchApp.fetch(url).getContentText());
}

function testGetMessageAccess() {
  Logger.log(JSON.stringify(MESSAGE_KEYS));
  Logger.log(getMessage(MESSAGE_KEYS.ADMIN_LOCATIONS));
}

function testSendAdminMainMenu() {
  const settings = getSettings();

  sendAdminMainMenu(726107007, settings);
}

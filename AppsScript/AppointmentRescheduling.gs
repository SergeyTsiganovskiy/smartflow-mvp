
function showRescheduleDateOptions(chatId, settings) {
  setUserState(
    chatId,
    STATES.WAITING_RESCHEDULE_DATE
  );

  const keyboard = buildKeyboardWithMainMenu([
    [
      { text: getMessage(MESSAGE_KEYS.TODAY) },
      { text: getMessage(MESSAGE_KEYS.TOMORROW) }
    ],
    [
      { text: getMessage(MESSAGE_KEYS.DAY_AFTER_TOMORROW) }
    ],
    [
      { text: getMessage(MESSAGE_KEYS.OTHER_DATE) }
    ]
  ]);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_RESCHEDULE_DATE),
    keyboard
  );
}

function showRescheduleTimeOptions(chatId, settings) {
  const session = getUserSession(chatId);

  let providerId = '';
  let durationMinutes = 60;
  let customerId = '';

  if (session.pending_calendar_event_id) {
    const event = getCalendarEventById(
      session.pending_calendar_event_id
    );

    if (!event) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
      );
      return;
    }

    const data =
      extractSmartflowCalendarData(
        event.description
      ) || {};

    const provider =
      data.provider_id
        ? findProviderById(data.provider_id)
        : null;

    if (!provider) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.PROVIDER_SELECT_FROM_LIST)
      );
      return;
    }

    providerId = provider.id;

    durationMinutes = Math.round(
      (event.end_at.getTime() - event.start_at.getTime()) / 60000
    );

    const customer =
      data.customer_id
        ? getCustomerById(data.customer_id)
        : null;

    customerId =
      customer && customer.customer_id
        ? customer.customer_id
        : '';
  } else {
    const appointment = getAppointmentById(
      session.reschedule_appointment_id
    );

    if (!appointment) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
      );
      return;
    }

    providerId = appointment.provider_id;
    customerId = appointment.customer_id;

    durationMinutes = getServiceDurationMinutes(
      appointment.customer_id,
      appointment.service_id
    );
  }

  const slots = getAvailableTimeSlots(
    providerId,
    session.reschedule_date,
    durationMinutes,
    customerId
  );

  if (slots.length === 0) {
    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_AVAILABLE_TIME)
    );

    showRescheduleDateOptions(chatId, settings);
    return;
  }

  const keyboardRows = [];

  for (let i = 0; i < slots.length; i += 2) {
    const row = [
      { text: slots[i] }
    ];

    if (slots[i + 1]) {
      row.push({
        text: slots[i + 1]
      });
    }

    keyboardRows.push(row);
  }

  const keyboard = buildKeyboardWithMainMenu(
    keyboardRows
  );

  setUserState(
    chatId,
    'WAITING_RESCHEDULE_TIME'
  );

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_TIME),
    keyboard
  );
}

function showRescheduleCustomDateOptions(
  chatId,
  settings
) {
  setUserState(
    chatId,
    'WAITING_RESCHEDULE_CUSTOM_DATE'
  );

  const keyboardRows = [];
  const today = new Date();

  const cacheDays =
    Number(
      settings.CalendarCacheDays || 30
    );

  for (let i = 0; i < cacheDays; i++) {
    const date =
      addDaysToDate(today, i);

    keyboardRows.push([
      {
        text: formatDateButton(date)
      }
    ]);
  }

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_DATE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

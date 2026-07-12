function confirmAppointmentByCustomer(
  appointmentId
) {
  updateAppointmentField(
    appointmentId,
    'customer_confirmed',
    true
  );

  updateAppointmentField(
    appointmentId,
    'customer_confirmed_at',
    new Date()
  );
}

function processAppointmentConfirmation(
  callbackQuery
) {
  const data =
    callbackQuery.data || '';

  const appointmentId =
    data.split(':')[1];

  if (!appointmentId) {
    return;
  }

  const appointment =
    getAppointmentById(
      appointmentId
    );

  if (!appointment) {
    answerCallbackQuery(
      callbackQuery.id,
      getMessage(
        MESSAGE_KEYS.APPOINTMENT_NOT_FOUND
      )
    );

    return;
  }

  if (
    String(
      appointment.customer_confirmed || ''
    ).toUpperCase() === 'TRUE'
  ) {
    answerCallbackQuery(
      callbackQuery.id,
      getMessage(
        MESSAGE_KEYS.APPOINTMENT_ALREADY_CONFIRMED
      )
    );

    return;
  }

  confirmAppointmentByCustomer(
    appointmentId
  );

  notifyAdminsAboutCustomerConfirmation(
    appointment
  );

  const settings =
  getSettings();

  editTelegramMessageReplyMarkup(
    settings.ClientBotToken,
    callbackQuery.message.chat.id,
    callbackQuery.message.message_id,
    {}
  );

  answerCallbackQuery(
    callbackQuery.id,
    getMessage(
      MESSAGE_KEYS.APPOINTMENT_CONFIRMED_BY_CUSTOMER
    )
  );

  sendTelegramMessage(
    settings.ClientBotToken,
    callbackQuery.message.chat.id,
    getMessage(
      MESSAGE_KEYS.APPOINTMENT_CONFIRMED_BY_CUSTOMER
    )
  );
}

function getCustomerConfirmationText(appointment) {
  const confirmed =
    String(appointment.customer_confirmed || '').toUpperCase() === 'TRUE' ||
    appointment.customer_confirmed === true;

  return confirmed
    ? getMessage(MESSAGE_KEYS.APPOINTMENT_CONFIRMED_BY_CUSTOMER)
    : '⏳ ' + getMessage(MESSAGE_KEYS.APPOINTMENT_NOT_CONFIRMED_BY_CUSTOMER);
}

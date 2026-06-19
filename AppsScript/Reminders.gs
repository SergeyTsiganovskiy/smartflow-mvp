function send24hAppointmentReminders() {
  const settings = getSettings();

  const now = new Date();

  const currentHour = Number(
    Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      'H'
    )
  );

  if (
    currentHour < 8 ||
    currentHour >= 23
  ) {
    return;
  }

  const appointments =
    getAppointmentsFor24hReminder();

  appointments.forEach(function(
    appointment
  ) {

    appointment = syncAppointmentWithCalendar(
      appointment,
      true
    );

    const customer =
      getCustomerById(
        appointment.customer_id
      );

    if (
      !customer ||
      !customer.telegram_id
    ) {
      return;
    }

    const text =
      buildAppointmentReminderText(
        appointment
      );

    sendTelegramMessage(
      settings.ClientBotToken,
      customer.telegram_id,
      text
    );

    markAppointmentReminder24hSent(
      appointment.appointment_id
    );
  });
}

function buildAppointmentReminderText(
  appointment
) {
  const service =
    findServiceById(
      appointment.service_id
    );

  const provider =
    findProviderById(
      appointment.provider_id
    );

  const location =
    findLocationById(
      appointment.location_id
    );

  const customerNote =
    String(
      appointment.customer_note || ''
    ).trim() || '-';

  return (
    getMessage(
      MESSAGE_KEYS.APPOINTMENT_REMINDER_24H
    ) +
    '\n\n' +
    '📅 ' +
    formatDateTimeForDisplay(
      appointment.start_at
    ) +
    '\n' +
    '💅 ' +
    service.name +
    '\n' +
    '👩‍💼 ' +
    provider.name +
    '\n' +
    '📍 ' +
    location.name +
    '\n' +
    '📝 Комментарий: ' +
    customerNote
  );
}

function markAppointmentReminder24hSent(
  appointmentId
) {
  updateAppointmentField(
    appointmentId,
    'reminder_24h_sent_at',
    new Date()
  );
}

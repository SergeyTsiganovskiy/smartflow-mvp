function send24hAppointmentReminders() {
  const settings = getSettings();

  if (!isSettingEnabled(settings.ReminderDayBefore, true)) {
    return;
  }

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

  appointments.forEach(function(appointment) {
    appointment =
      syncAppointmentWithCalendar(appointment);

    if (!appointment) {
      return;
    }

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
      text,
      buildAppointmentConfirmInlineKeyboard(
        appointment.appointment_id
      )
    );

    markAppointmentReminder24hSent(
      appointment.appointment_id
    );
  });
}

function buildAppointmentConfirmInlineKeyboard(
  appointmentId
) {
  return {
    inline_keyboard: [
      [
        {
          text: getMessage(
            MESSAGE_KEYS.CUSTOMER_CONFIRM_APPOINTMENT
          ),
          callback_data:
            'confirm_appointment:' +
            appointmentId
        }
      ]
    ]
  };
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

function getAppointmentsFor24hReminder() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.APPOINTMENTS);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const statusIndex = headers.indexOf('status');
  const reminderIndex = headers.indexOf('reminder_24h_sent_at');

  const timezone = getSettings().TimeZone || 'Europe/Kyiv';

  const now = new Date();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowString = Utilities.formatDate(
    tomorrow,
    timezone,
    'yyyy-MM-dd'
  );

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const status = String(rows[i][statusIndex] || '').toLowerCase();
    const reminderSentAt = rows[i][reminderIndex];

    if (status !== 'confirmed') {
      continue;
    }

    if (reminderSentAt) {
      continue;
    }

    let appointment = {};

    headers.forEach(function(header, index) {
      appointment[header] = rows[i][index];
    });

    appointment = syncAppointmentWithCalendar(
      appointment
    );

    const appointmentDateString =
      normalizeDateForStorage(
        appointment.start_at
      );

    if (appointmentDateString !== tomorrowString) {
      continue;
    }

    result.push(appointment);
  }

  return result;
}

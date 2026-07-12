function sendAdminNotification(text, inlineKeyboard) {
  const settings = getSettings();
  const recipients = getActiveRequestRecipients();

  if (recipients.length === 0) {
    addAuditLog(
      'ADMIN_NOTIFICATION_SKIPPED',
      'No active RequestRecipients'
    );

    return false;
  }

  recipients.forEach(function(recipient) {
    if (inlineKeyboard) {
      sendTelegramMessageWithInlineKeyboard(
        settings.AdminBotToken,
        recipient.telegram_id,
        text,
        inlineKeyboard
      );

      return;
    }

    sendTelegramMessage(
      settings.AdminBotToken,
      recipient.telegram_id,
      text
    );
  });

  return true;
}

function notifyAdminsAboutCancellation(
  appointment
) {
  const settings = getSettings();

  const customer =
    getCustomerById(
      appointment.customer_id
    );

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

  const text =
    '❌ ' +
    getMessage(
      MESSAGE_KEYS.ADMIN_APPOINTMENT_CANCELLED
    ) +
    '\n\n' +

    '👤 ' +
    (customer
      ? customer.name
      : '') +
    '\n' +

    '📞 ' +
    (customer
      ? customer.phone
      : '') +
    '\n\n' +

    '📅 ' +
    formatDateTimeForDisplay(
      appointment.start_at
    ) +
    '\n' +

    '💅 ' +
    (service
      ? service.name
      : '') +
    '\n' +

    '👩‍💼 ' +
    (provider
      ? provider.name
      : '') +
    '\n' +

    '📍 ' +
    (location
      ? location.name
      : '');

  sendAdminNotification(text);
}
function notifyAdminsAboutReschedule(appointment, oldStartAt, oldEndAt) {
  const settings = getSettings();

  const customer = getCustomerById(appointment.customer_id);
  const service = findServiceById(appointment.service_id);
  const provider = findProviderById(appointment.provider_id);
  const location = findLocationById(appointment.location_id);

  const text =
    '🔄 ' + getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENT_RESCHEDULED) +
    '\n\n' +
    '👤 ' + (customer ? customer.name : '') + '\n' +
    '📞 ' + (customer ? customer.phone : '') + '\n\n' +
    'Было:\n' +
    formatDateTimeForDisplay(oldStartAt) + '\n\n' +
    'Стало:\n' +
    formatDateTimeForDisplay(appointment.start_at) + '\n\n' +
    '💅 ' + (service ? service.name : '') + '\n' +
    '👩‍💼 ' + (provider ? provider.name : '') + '\n' +
    '📍 ' + (location ? location.name : '');

  sendAdminNotification(text);
}

function notifyAdminsAboutCustomerConfirmation(
  appointment
) {
  const settings =
    getSettings();

  const customer =
    getCustomerById(
      appointment.customer_id
    );

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

  let text =
    '<b>' +
    getMessage(
      MESSAGE_KEYS.PROVIDER_CUSTOMER_CONFIRMED_APPOINTMENT
    ) +
    '</b>\n\n';

  text +=
    '👤 ' +
    (customer ? customer.name : '-') +
    '\n';

  text +=
    '📞 ' +
    (customer ? customer.phone : '-') +
    '\n';

  text +=
    '📅 ' +
    formatDateTimeForDisplay(
      appointment.start_at
    ) +
    '\n';

  text +=
    '💅 ' +
    (service ? service.name : '-') +
    '\n';

  text +=
    '👩‍💼 ' +
    (provider ? provider.name : '-') +
    '\n';

  text +=
    '📍 ' +
    (location ? location.name : '-');

  sendAdminNotification(text);
}

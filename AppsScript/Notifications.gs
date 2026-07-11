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

function notifyAdminsAboutRequestFromSession(session, requestId) {
  const settings = getSettings();

  const location = findLocationById(session.location_id);
  const service = findServiceById(session.service_id);
  const provider = findProviderById(session.provider_id);

  const customerNote =
    String(session.customer_note || '').trim() || '-';

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.NEW_REQUEST_ADMIN_TITLE) +
    '</b>\n\n';

  text +=
    '👤 ' +
    getMessage(MESSAGE_KEYS.ADMIN_CUSTOMER) +
    ': ' +
    session.customer_name +
    '\n';

  text +=
    '📞 ' +
    getMessage(MESSAGE_KEYS.ADMIN_PHONE) +
    ': ' +
    session.customer_phone +
    '\n';

  text +=
    '📝 Комментарий: ' +
    customerNote +
    '\n\n';

  text +=
    '📍 ' +
    getMessage(MESSAGE_KEYS.ADMIN_LOCATION) +
    ': ' +
    (location ? location.name : session.location_id) +
    '\n';

  text +=
    '💅 ' +
    getMessage(MESSAGE_KEYS.ADMIN_SERVICE) +
    ': ' +
    (service ? service.name : session.service_id) +
    '\n';

  text +=
    '👩‍💼 ' +
    getMessage(MESSAGE_KEYS.ADMIN_PROVIDER) +
    ': ' +
    (provider ? provider.name : session.provider_id) +
    '\n\n';

  text +=
    '<b>' +
    getMessage(MESSAGE_KEYS.ADMIN_TIME_OPTIONS) +
    ':</b>\n';

  for (let i = 1; i <= 3; i++) {
    const date = session['option' + i + '_date'];
    const time = session['option' + i + '_time'];

    if (date && time) {
      text +=
        i +
        ') ' +
        formatDateForDisplay(date) +
        ' ' +
        formatTimeForDisplay(time) +
        '\n';
    }
  }

  const approveButtons = [];

  for (let i = 1; i <= 3; i++) {
    const date = session['option' + i + '_date'];
    const time = session['option' + i + '_time'];

    if (date && time) {
      approveButtons.push({
        text: '✅ ' + i,
        callback_data: 'approve_option_' + i + '|' + requestId
      });
    }
  }

  const inlineKeyboard = [];

  if (approveButtons.length > 0) {
    inlineKeyboard.push(approveButtons);
  }

  inlineKeyboard.push([
    {
      text: '❌ Reject',
      callback_data: 'reject_request|' + requestId
    }
  ]);

  sendAdminNotification(text, inlineKeyboard);
}

function buildAdminRequestConfirmedText(
  request,
  options,
  approvedPriority
) {
  const customer = getCustomerById(request.customer_id);
  const service = findServiceById(request.service_id);
  const provider = findProviderById(request.provider_id);
  const location = findLocationById(request.location_id);

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.NEW_REQUEST_ADMIN_TITLE) +
    '</b>\n\n';

  text +=
    '👤 ' +
    getMessage(MESSAGE_KEYS.ADMIN_CUSTOMER) +
    ': ' +
    (customer ? customer.name : request.customer_id) +
    '\n';

  text +=
    '📞 ' +
    getMessage(MESSAGE_KEYS.ADMIN_PHONE) +
    ': ' +
    (customer ? customer.phone : '') +
    '\n';

  text +=
    '📝 Комментарий: ' +
    (String(request.customer_note || '').trim() || '-') +
    '\n\n';

  text +=
    '📍 ' +
    getMessage(MESSAGE_KEYS.ADMIN_LOCATION) +
    ': ' +
    (location ? location.name : request.location_id) +
    '\n';

  text +=
    '💅 ' +
    getMessage(MESSAGE_KEYS.ADMIN_SERVICE) +
    ': ' +
    (service ? service.name : request.service_id) +
    '\n';

  text +=
    '👩‍💼 ' +
    getMessage(MESSAGE_KEYS.ADMIN_PROVIDER) +
    ': ' +
    (provider ? provider.name : request.provider_id) +
    '\n\n';

  text +=
    '<b>' +
    getMessage(MESSAGE_KEYS.ADMIN_TIME_OPTIONS) +
    ':</b>\n';

  options.forEach(function(option) {
    const line =
      option.priority +
      ') ' +
      formatDateForDisplay(option.preferred_date) +
      ' ' +
      formatTimeForDisplay(option.preferred_time);

    if (
      options.length > 1 &&
      Number(option.priority) ===
      Number(approvedPriority)
    ) {
      text += '<b>' + line + '</b>\n';
    } else {
      text += line + '\n';
    }
  });

  text +=
    '\n' +
    getMessage(
      MESSAGE_KEYS.ADMIN_REQUEST_CONFIRMED_STATUS
    );

  return text;
}

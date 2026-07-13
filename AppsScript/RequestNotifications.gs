function notifyAdminsAboutRequestFromSession(session, requestId) {
  const settings = getSettings();

  const location = findLocationById(session.location_id);
  const service = findServiceById(session.service_id);
  const provider = findProviderById(session.provider_id);

  const customerNote = String(session.customer_note || '').trim() || '-';

  let text = '<b>' + getMessage(MESSAGE_KEYS.NEW_REQUEST_ADMIN_TITLE) + '</b>\n\n';

  text += '👤 ' + getMessage(MESSAGE_KEYS.ADMIN_CUSTOMER) + ': ' + session.customer_name + '\n';

  text += '📞 ' + getMessage(MESSAGE_KEYS.ADMIN_PHONE) + ': ' + session.customer_phone + '\n';

  text += '📝 Комментарий: ' + customerNote + '\n\n';

  text +=
    '📍 ' + getMessage(MESSAGE_KEYS.ADMIN_LOCATION) + ': ' + (location ? location.name : session.location_id) + '\n';

  text += '💅 ' + getMessage(MESSAGE_KEYS.ADMIN_SERVICE) + ': ' + (service ? service.name : session.service_id) + '\n';

  text +=
    '👩‍💼 ' + getMessage(MESSAGE_KEYS.ADMIN_PROVIDER) + ': ' + (provider ? provider.name : session.provider_id) + '\n\n';

  text += '<b>' + getMessage(MESSAGE_KEYS.ADMIN_TIME_OPTIONS) + ':</b>\n';

  for (let i = 1; i <= 3; i++) {
    const date = session['option' + i + '_date'];
    const time = session['option' + i + '_time'];

    if (date && time) {
      text += i + ') ' + formatDateForDisplay(date) + ' ' + formatTimeForDisplay(time) + '\n';
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

function buildAdminRequestConfirmedText(request, options, approvedPriority) {
  const customer = getCustomerById(request.customer_id);
  const service = findServiceById(request.service_id);
  const provider = findProviderById(request.provider_id);
  const location = findLocationById(request.location_id);

  let text = '<b>' + getMessage(MESSAGE_KEYS.NEW_REQUEST_ADMIN_TITLE) + '</b>\n\n';

  text +=
    '👤 ' + getMessage(MESSAGE_KEYS.ADMIN_CUSTOMER) + ': ' + (customer ? customer.name : request.customer_id) + '\n';

  text += '📞 ' + getMessage(MESSAGE_KEYS.ADMIN_PHONE) + ': ' + (customer ? customer.phone : '') + '\n';

  text += '📝 Комментарий: ' + (String(request.customer_note || '').trim() || '-') + '\n\n';

  text +=
    '📍 ' + getMessage(MESSAGE_KEYS.ADMIN_LOCATION) + ': ' + (location ? location.name : request.location_id) + '\n';

  text += '💅 ' + getMessage(MESSAGE_KEYS.ADMIN_SERVICE) + ': ' + (service ? service.name : request.service_id) + '\n';

  text +=
    '👩‍💼 ' + getMessage(MESSAGE_KEYS.ADMIN_PROVIDER) + ': ' + (provider ? provider.name : request.provider_id) + '\n\n';

  text += '<b>' + getMessage(MESSAGE_KEYS.ADMIN_TIME_OPTIONS) + ':</b>\n';

  options.forEach(function (option) {
    const line =
      option.priority +
      ') ' +
      formatDateForDisplay(option.preferred_date) +
      ' ' +
      formatTimeForDisplay(option.preferred_time);

    if (options.length > 1 && Number(option.priority) === Number(approvedPriority)) {
      text += '<b>' + line + '</b>\n';
    } else {
      text += line + '\n';
    }
  });

  text += '\n' + getMessage(MESSAGE_KEYS.ADMIN_REQUEST_CONFIRMED_STATUS);

  return text;
}

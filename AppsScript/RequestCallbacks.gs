function processRequestApproveOption(callbackQuery, action, requestId) {
  const settings = getSettings();

  const adminChatId = callbackQuery.message.chat.id;

  const messageId = callbackQuery.message.message_id;

  const priority = Number(action.replace('approve_option_', ''));

  const request = getRequestById(requestId);

  const option = getRequestOptionByPriority(requestId, priority);
  const existingAppointment = getAppointmentByRequestId(requestId);

  addAuditLog(
    'APPROVE_OPTION_DEBUG',
    JSON.stringify({
      requestId: requestId,
      priority: priority,
      request: request,
      option: option,
      appointmentExists: Boolean(existingAppointment)
    })
  );

  if (!request || !option) {
    sendTelegramMessage(settings.AdminBotToken, adminChatId, getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND));

    return;
  }

  if (isRequestAlreadyProcessed(requestId)) {
    editTelegramMessageReplyMarkup(settings.AdminBotToken, adminChatId, messageId);
    sendTelegramMessage(settings.AdminBotToken, adminChatId, getMessage(MESSAGE_KEYS.REQUEST_ALREADY_PROCESSED));

    return;
  }

  const appointmentId = existingAppointment
    ? existingAppointment.appointment_id
    : createAppointmentFromRequest(request, option);
  let calendarEventId = existingAppointment ? existingAppointment.calendar_event_id : '';

  try {
    if (!calendarEventId) {
      calendarEventId = createCalendarEventForAppointment(appointmentId);
    }
  } catch (error) {
    addAuditLog(
      'REQUEST_CALENDAR_ERROR',
      JSON.stringify({ request_id: requestId, appointment_id: appointmentId, error: String(error) })
    );
  }

  if (!calendarEventId) {
    sendTelegramMessage(settings.AdminBotToken, adminChatId, getMessage(MESSAGE_KEYS.REQUEST_CALENDAR_ERROR));
    return;
  }

  updateCustomerStatus(request.customer_id, 'confirmed');

  updateRequestStatus(requestId, 'confirmed');

  updateRequestOptionsAfterApproval(requestId, priority);

  const customer = getCustomerById(request.customer_id);

  const service = findServiceById(request.service_id);

  const provider = findProviderById(request.provider_id);

  const location = findLocationById(request.location_id);

  const requestOptions = getRequestOptionsByRequestId(requestId);

  const adminText = buildAdminRequestConfirmedText(request, requestOptions, priority);

  editTelegramMessage(settings.AdminBotToken, adminChatId, messageId, adminText);

  if (customer && customer.telegram_id) {
    const clientText =
      getMessage(MESSAGE_KEYS.REQUEST_APPROVED_CLIENT) +
      '\n\n' +
      '📅 ' +
      formatDateForDisplay(option.preferred_date) +
      ' ' +
      formatTimeForDisplay(option.preferred_time) +
      '\n' +
      '💅 ' +
      (service ? service.name : request.service_id) +
      '\n' +
      '👩‍💼 ' +
      (provider ? provider.name : request.provider_id) +
      '\n' +
      '📍 ' +
      (location ? location.name : request.location_id);

    sendTelegramMessage(settings.ClientBotToken, customer.telegram_id, clientText);
  }
}

function processRequestReject(callbackQuery, requestId) {
  const settings = getSettings();
  const adminChatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;

  if (isRequestAlreadyProcessed(requestId) || appointmentExistsForRequest(requestId)) {
    editTelegramMessageReplyMarkup(settings.AdminBotToken, adminChatId, messageId);
    sendTelegramMessage(settings.AdminBotToken, adminChatId, getMessage(MESSAGE_KEYS.REQUEST_ALREADY_PROCESSED));
    return;
  }

  updateRequestStatus(requestId, 'rejected');

  updateRequestOptionsAfterApproval(requestId, 0);

  const request = getRequestById(requestId);

  const customer = request ? getCustomerById(request.customer_id) : null;

  const originalText = callbackQuery.message.text || '';

  editTelegramMessage(
    settings.AdminBotToken,
    adminChatId,
    messageId,
    originalText + '\n\n' + getMessage(MESSAGE_KEYS.ADMIN_REQUEST_REJECTED_STATUS)
  );

  if (customer && customer.telegram_id) {
    sendTelegramMessage(
      settings.ClientBotToken,
      customer.telegram_id,
      getMessage(MESSAGE_KEYS.REQUEST_REJECTED_CLIENT)
    );
  }
}

function doPost(e) {
  try {
    const update = JSON.parse(e.postData.contents);
    const botType = e.parameter && e.parameter.bot ? e.parameter.bot : 'client';

    if (update.update_id !== undefined && update.update_id !== null) {
      processTelegramUpdateOnce(update.update_id, botType, function () {
        routeTelegramUpdate(update, botType);
      });
    } else {
      routeTelegramUpdate(update, botType);
    }

    return HtmlService.createHtmlOutput('OK');
  } catch (error) {
    addAuditLog('DOPOST_ERROR', String(error));

    return HtmlService.createHtmlOutput('ERROR');
  }
}

function routeTelegramUpdate(update, botType) {
  if (botType === 'admin') {
    if (update.message) {
      handleAdminMessage(update.message);
    }

    if (update.callback_query) {
      handleAdminCallback(update.callback_query);
    }

    return;
  }

  if (update.message) {
    handleClientMessage(update.message);
  }

  if (update.callback_query) {
    handleClientCallback(update.callback_query);
  }
}

function handleAdminCallback(callbackQuery) {
  const settings = getSettings();
  const actorId = callbackQuery.from && callbackQuery.from.id;

  if (!isAdminUser(actorId)) {
    answerTelegramCallbackQuery(
      settings.AdminBotToken,
      callbackQuery.id,
      getMessage(MESSAGE_KEYS.ADMIN_ACCESS_DENIED),
      true
    );
    addAuditLog('ADMIN_CALLBACK_ACCESS_DENIED', String(actorId || 'unknown'));
    return;
  }

  const data = callbackQuery.data || '';

  const parts = data.split('|');

  const action = parts[0];

  const requestId = parts[1] || '';

  addAuditLog(
    'ADMIN_CALLBACK',
    JSON.stringify({
      data: data,
      action: action,
      requestId: requestId
    })
  );

  if (action.indexOf('approve_option_') === 0) {
    processRequestApproveOption(callbackQuery, action, requestId);

    return;
  }

  if (action === 'reject_request') {
    processRequestReject(callbackQuery, requestId);

    return;
  }

  addAuditLog('UNKNOWN_ADMIN_CALLBACK', data);
}

function handleClientCallback(callbackQuery) {
  const data = callbackQuery.data || '';

  if (data.indexOf('confirm_appointment:') === 0) {
    processAppointmentConfirmation(callbackQuery);

    return;
  }

  handleAppointmentCallback(callbackQuery);
}

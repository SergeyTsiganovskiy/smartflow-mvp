function doPost(e) {
  try {
    const update = JSON.parse(e.postData.contents);

    const botType = e.parameter && e.parameter.bot ? e.parameter.bot : 'client';

    if (update.update_id && isDuplicateTelegramUpdate(update.update_id, botType.toUpperCase())) {
      return HtmlService.createHtmlOutput('OK');
    }

    if (botType === 'admin') {
      if (update.message) {
        handleAdminMessage(update.message);
      }

      if (update.callback_query) {
        handleAdminCallback(update.callback_query);
      }

      return HtmlService.createHtmlOutput('OK');
    }

    if (update.message) {
      handleClientMessage(update.message);
    }

    if (update.callback_query) {
      handleClientCallback(update.callback_query);
    }

    return HtmlService.createHtmlOutput('OK');
  } catch (error) {
    addAuditLog('DOPOST_ERROR', String(error));

    return HtmlService.createHtmlOutput('ERROR');
  }
}

function handleAdminCallback(callbackQuery) {
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

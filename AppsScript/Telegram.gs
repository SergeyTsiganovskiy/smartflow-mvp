function sendTelegramMessage(botToken, chatId, text, keyboard) {
  const payload = {
    chat_id: String(chatId),
    text: text,
    parse_mode: 'HTML'
  };

  if (keyboard) {
    payload.reply_markup = JSON.stringify(keyboard);
  }

  return executeTelegramRequest('sendMessage', botToken, payload);
}

function sendTelegramMessageWithInlineKeyboard(botToken, chatId, text, inlineKeyboard) {
  const payload = {
    chat_id: String(chatId),
    text: text,
    parse_mode: 'HTML',
    reply_markup: JSON.stringify({
      inline_keyboard: inlineKeyboard
    })
  };

  return executeTelegramRequest('sendMessage', botToken, payload);
}

function editTelegramMessage(botToken, chatId, messageId, text) {
  const payload = {
    chat_id: String(chatId),
    message_id: messageId,
    text: text,
    parse_mode: 'HTML'
  };

  return executeTelegramRequest('editMessageText', botToken, payload);
}

function editTelegramMessageWithInlineKeyboard(botToken, chatId, messageId, text, inlineKeyboard) {
  const payload = {
    chat_id: String(chatId),
    message_id: messageId,
    text: text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: inlineKeyboard
    }
  };

  return executeTelegramRequest('editMessageText', botToken, payload);
}

function answerTelegramCallbackQuery(botToken, callbackQueryId, text, showAlert) {
  const payload = {
    callback_query_id: callbackQueryId,
    text: text || '',
    show_alert: showAlert === true
  };

  return executeTelegramRequest('answerCallbackQuery', botToken, payload);
}

function answerCallbackQuery(callbackQueryId, text) {
  const settings = getSettings();
  answerTelegramCallbackQuery(settings.ClientBotToken, callbackQueryId, text, false);
}

function editTelegramMessageReplyMarkup(botToken, chatId, messageId, replyMarkup) {
  const payload = {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: replyMarkup || {}
  };

  return executeTelegramRequest('editMessageReplyMarkup', botToken, payload);
}

function executeTelegramRequest(methodName, botToken, payload) {
  const url = 'https://api.telegram.org/bot' + botToken + '/' + methodName;
  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const responseText = response.getContentText();
  const responseCode = typeof response.getResponseCode === 'function' ? response.getResponseCode() : 200;
  let responseData = null;

  try {
    responseData = JSON.parse(responseText);
  } catch (error) {
    addAuditLog(
      'TELEGRAM_API_ERROR',
      JSON.stringify({ method: methodName, http_code: responseCode, error: 'INVALID_JSON_RESPONSE' })
    );
    return responseText;
  }

  if (responseCode < 200 || responseCode >= 300 || !responseData || responseData.ok !== true) {
    addAuditLog(
      'TELEGRAM_API_ERROR',
      JSON.stringify({
        method: methodName,
        http_code: responseCode,
        error_code: responseData && responseData.error_code ? responseData.error_code : '',
        description: responseData && responseData.description ? String(responseData.description) : ''
      })
    );
  }

  return responseText;
}

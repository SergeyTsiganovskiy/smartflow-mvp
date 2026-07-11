function sendTelegramMessage(botToken, chatId, text, keyboard) {
  const url =
    'https://api.telegram.org/bot' +
    botToken +
    '/sendMessage';

  const payload = {
    chat_id: String(chatId),
    text: text,
    parse_mode: 'HTML'
  };

  if (keyboard) {
    payload.reply_markup = JSON.stringify(keyboard);
  }

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const result = response.getContentText();

  Logger.log(result);

  return result;
}

function sendTelegramMessageWithInlineKeyboard(
  botToken,
  chatId,
  text,
  inlineKeyboard
) {
  const url =
    'https://api.telegram.org/bot' +
    botToken +
    '/sendMessage';

  const payload = {
    chat_id: String(chatId),
    text: text,
    parse_mode: 'HTML',
    reply_markup: JSON.stringify({
      inline_keyboard: inlineKeyboard
    })
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const result = response.getContentText();

  Logger.log(result);

  return result;
}

function editTelegramMessage(
  botToken,
  chatId,
  messageId,
  text
) {
  const url =
    'https://api.telegram.org/bot' +
    botToken +
    '/editMessageText';

  const payload = {
    chat_id: String(chatId),
    message_id: messageId,
    text: text,
    parse_mode: 'HTML'
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const result = response.getContentText();

  Logger.log(result);

  return result;
}

function editTelegramMessageWithInlineKeyboard(
  botToken,
  chatId,
  messageId,
  text,
  inlineKeyboard
) {
  const url =
    'https://api.telegram.org/bot' +
    botToken +
    '/editMessageText';

  const payload = {
    chat_id: String(chatId),
    message_id: messageId,
    text: text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: inlineKeyboard
    }
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const result = response.getContentText();

  addAuditLog(
    'EDIT_MESSAGE_WITH_KEYBOARD_RESULT',
    result
  );

  return result;
}

function setWebhook(botToken, webhookUrl) {
  const url =
    'https://api.telegram.org/bot' +
    botToken +
    '/setWebhook';

  const payload = {
    url: webhookUrl,
    drop_pending_updates: true
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const result = response.getContentText();

  Logger.log(result);

  return result;
}

function deleteWebhook(botToken) {
  const url =
    'https://api.telegram.org/bot' +
    botToken +
    '/deleteWebhook?drop_pending_updates=true';

  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    muteHttpExceptions: true
  });

  const result = response.getContentText();

  Logger.log(result);

  return result;
}

function getWebhookInfo(botToken) {
  const url =
    'https://api.telegram.org/bot' +
    botToken +
    '/getWebhookInfo';

  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    muteHttpExceptions: true
  });

  const result = response.getContentText();

  Logger.log(result);

  return result;
}

function setClientWebhook() {
  const settings = getSettings();

  return setWebhook(
    settings.ClientBotToken,
    settings.AppsScriptUrl + '?bot=client'
  );
}

function setAdminWebhook() {
  const settings = getSettings();

  return setWebhook(
    settings.AdminBotToken,
    settings.AppsScriptUrl + '?bot=admin'
  );
}

function deleteClientWebhook() {
  const settings = getSettings();

  return deleteWebhook(
    settings.ClientBotToken
  );
}

function deleteAdminWebhook() {
  const settings = getSettings();

  return deleteWebhook(
    settings.AdminBotToken
  );
}

function getClientWebhookInfo() {
  const settings = getSettings();

  return getWebhookInfo(
    settings.ClientBotToken
  );
}

function getAdminWebhookInfo() {
  const settings = getSettings();

  return getWebhookInfo(
    settings.AdminBotToken
  );
}

function pollClientBot() {
  const settings = getSettings();
  const botToken = settings.ClientBotToken;

  const offset = Number(
    PropertiesService
      .getScriptProperties()
      .getProperty('CLIENT_OFFSET') || 0
  );

  const url =
    'https://api.telegram.org/bot' +
    botToken +
    '/getUpdates?offset=' +
    offset +
    '&timeout=10';

  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    muteHttpExceptions: true
  });

  const data =
    JSON.parse(
      response.getContentText()
    );

  if (!data.ok) {
    Logger.log(data);
    return;
  }

  data.result.forEach(function(update) {
    if (update.message) {
      handleClientMessage(update.message);
    }

    PropertiesService
      .getScriptProperties()
      .setProperty(
        'CLIENT_OFFSET',
        String(update.update_id + 1)
      );
  });
}

function answerCallbackQuery(
  callbackQueryId,
  text
) {
  const settings =
    getSettings();

  const url =
    'https://api.telegram.org/bot' +
    settings.ClientBotToken +
    '/answerCallbackQuery';

  const payload = {
    callback_query_id: callbackQueryId,
    text: text || '',
    show_alert: false
  };

  UrlFetchApp.fetch(
    url,
    {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    }
  );
}

function editTelegramMessageReplyMarkup(
  botToken,
  chatId,
  messageId,
  replyMarkup
) {
  const url =
    'https://api.telegram.org/bot' +
    botToken +
    '/editMessageReplyMarkup';

  const payload = {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: replyMarkup || {}
  };

  UrlFetchApp.fetch(
    url,
    {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    }
  );
}

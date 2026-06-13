function sendTelegramMessage(botToken, chatId, text, keyboard) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

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

function setClientWebhook() {
  const settings = getSettings();

  const botToken = settings.ClientBotToken;
  const webAppUrl = settings.ClientWebAppUrl;

  const url = `https://api.telegram.org/bot${botToken}/setWebhook`;

  const payload = {
    url: webAppUrl,
    drop_pending_updates: true,
    allowed_updates: ['message', 'callback_query']
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  Logger.log(response.getContentText());
}

function getClientWebhookInfo() {
  const settings = getSettings();
  const botToken = settings.ClientBotToken;

  const url = `https://api.telegram.org/bot${botToken}/getWebhookInfo`;

  const response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function deleteClientWebhook() {
  const settings = getSettings();
  const botToken = settings.ClientBotToken;

  const url = `https://api.telegram.org/bot${botToken}/deleteWebhook?drop_pending_updates=true`;

  const response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function pollClientBot() {
  const settings = getSettings();
  const botToken = settings.ClientBotToken;

  const offset = Number(PropertiesService.getScriptProperties().getProperty('CLIENT_OFFSET') || 0);

  const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=10`;

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  if (!data.ok) {
    Logger.log(data);
    return;
  }

  data.result.forEach(update => {
    if (update.message) {
      handleClientMessage(update.message);
    }

    PropertiesService
      .getScriptProperties()
      .setProperty('CLIENT_OFFSET', update.update_id + 1);
  });
}

function sendTelegramMessageWithInlineKeyboard(botToken, chatId, text, inlineKeyboard) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

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

  Logger.log(response.getContentText());

  return response.getContentText();
}

function editTelegramMessage(botToken, chatId, messageId, text) {
  const url = `https://api.telegram.org/bot${botToken}/editMessageText`;

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

  Logger.log(response.getContentText());

  return response.getContentText();
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

  Logger.log(response.getContentText());

  return response.getContentText();
}
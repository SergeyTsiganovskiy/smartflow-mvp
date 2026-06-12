function doPost(e) {
  try {
    const update = JSON.parse(e.postData.contents);

    if (update.message) {
      handleClientMessage(update.message);
    }

    if (update.callback_query) {
      handleOwnerCallback(update.callback_query);
    }

    return HtmlService.createHtmlOutput('OK');

  } catch (error) {
    addAuditLog('DOPOST_ERROR', error.toString());
    return HtmlService.createHtmlOutput('ERROR');
  }
}

function testMessages() {
  const text = getMessage('START');
  Logger.log(text);
}

function testSendTelegram() {
  const settings = getSettings();

  sendTelegramMessage(
    settings.ClientBotToken,
    settings.OwnerTelegramId,
    'SmartFlow test successful ✅'
  );
}

function testSendToOwner() {
  const settings = getSettings();

  sendTelegramMessage(
    settings.ClientBotToken,
    settings.OwnerTelegramId,
    'Manual test from current project ✅'
  );
}

function testSelectPeriodMessage() {
  Logger.log(MESSAGE_KEYS.SELECT_PERIOD);
  Logger.log(getMessage(MESSAGE_KEYS.SELECT_PERIOD));
}
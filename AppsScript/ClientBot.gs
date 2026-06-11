function handleClientMessage(message) {
  const settings = getSettings();

  const chatId = message.chat.id;
  const text = message.text || '';
  const state = getUserState(chatId);

  if (text === '/start') {
    sendClientStartMenu(chatId, settings);
    return;
  }

  if (text === getMessage('BOOK')) {
    showLocations(chatId, settings);
    return;
  }

  if (state === 'WAITING_LOCATION') {
    const location = findLocationByName(text);

    if (!location) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        'Пожалуйста, выберите филиал кнопкой из списка.'
      );
      return;
    }

    setUserSessionValue(chatId, 'location_id', location.id);
    setUserState(chatId, 'WAITING_SERVICE');

    showServices(chatId, settings);
    return;
  }

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    'Пока я понимаю только команду /start'
  );
}

function sendClientStartMenu(chatId, settings) {
  const text =
    getMessage('START') + '\n\n' +
    getMessage('BOOK') + ' / ' +
    getMessage('SERVICES') + ' / ' +
    getMessage('PRICES') + ' / ' +
    getMessage('CONTACTS');

  const keyboard = {
    keyboard: [
      [{ text: getMessage('BOOK') }, { text: getMessage('SERVICES') }],
      [{ text: getMessage('PRICES') }, { text: getMessage('CONTACTS') }]
    ],
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    text,
    keyboard
  );
}

function showLocations(chatId, settings) {

  const locations = getLocations();

  const keyboardRows = [];

  locations.forEach(location => {

    keyboardRows.push([
      {
        text: location.name
      }
    ]);

  });

  const keyboard = {
    keyboard: keyboardRows,
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    'Выберите филиал',
    keyboard
  );

  setUserState(
    chatId,
    'WAITING_LOCATION'
  );
}

function showServices(chatId, settings) {
  const services = getServices();

  const keyboardRows = [];

  services.forEach(service => {
    keyboardRows.push([{ text: service.name }]);
  });

  const keyboard = {
    keyboard: keyboardRows,
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    'Выберите услугу',
    keyboard
  );

  setUserState(chatId, 'WAITING_SERVICE');
}

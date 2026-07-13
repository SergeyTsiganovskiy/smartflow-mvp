function showContacts(chatId, settings) {
  const locations = getLocations();

  let text = '📞 ' + getMessage(MESSAGE_KEYS.CONTACTS) + '\n\n';

  locations.forEach(function (location) {
    text += '📍 ' + location.name + '\n';

    if (location.address) {
      text += '🏠 ' + location.address + '\n';
    }

    if (location.phone_1) {
      text += '📞 +' + String(location.phone_1) + '\n';
    }

    if (location.phone_2) {
      text += '📞 +' + String(location.phone_2) + '\n';
    }

    if (location.working_hours) {
      text += '🕒 ' + location.working_hours + '\n';
    }

    if (location.telegram) {
      text += '💬 ' + location.telegram + '\n';
    }

    if (location.instagram) {
      text += '📷 ' + location.instagram + '\n';
    }

    if (location.website) {
      text += '🌐 ' + location.website + '\n';
    }

    if (location.google_maps_url) {
      text += '🗺️ ' + location.google_maps_url + '\n';
    }

    text += '\n';
  });

  const keyboard = buildKeyboardWithMainMenu([]);

  sendTelegramMessage(settings.ClientBotToken, chatId, text, keyboard);
}

function getAdminTelegramIds(settings) {
  return String((settings || {}).AdminTelegramIds || '')
    .split(',')
    .map(function (id) {
      return String(id).trim();
    })
    .filter(function (id) {
      return id;
    });
}

function isAdminUser(chatId) {
  const adminIds = getAdminTelegramIds(getSettings());

  const chatIdText = String(chatId).trim();

  return adminIds.indexOf(chatIdText) !== -1;
}

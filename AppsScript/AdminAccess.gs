
function isAdminUser(chatId) {
  const settings = getSettings();

  const adminIds =
    String(settings.AdminTelegramIds || '')
      .split(',')
      .map(function(id) {
        return String(id).trim();
      })
      .filter(function(id) {
        return id;
      });

  const chatIdText =
    String(chatId).trim();

  return adminIds.indexOf(chatIdText) !== -1;
}

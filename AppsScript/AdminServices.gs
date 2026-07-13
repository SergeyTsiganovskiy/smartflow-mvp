
function sendServicesMenu(chatId, settings) {
  navigateAdmin(chatId, ADMIN_MENUS.SERVICES);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_SERVICES),
    buildServicesMenuKeyboard()
  );
}

function buildServicesMenuKeyboard() {
  return buildKeyboardWithMainMenu([
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_ADD_SERVICE) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICE_LIST) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_CUSTOMER_SERVICES) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICE_EDIT) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICE_DISABLE) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICE_ENABLE) }]
  ]);
}




















function resetServiceWizardSession(chatId) {
  setUserSessionValues(
    chatId,
    {
      service_name: '',
      service_location_id: '',
      service_duration_min: '',
      service_duration_max: '',

      edit_service_id: '',
      edit_service_field: ''
    }
  );

  setUserState(
    chatId,
    ''
  );
}

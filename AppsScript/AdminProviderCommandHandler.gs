function handleAdminProviderCommand(chatId, text, settings) {
  if (text === getMessage(MESSAGE_KEYS.ADMIN_ADD_PROVIDER)) {
    resetProviderWizardSession(chatId);

    startCreateProvider(chatId, settings);

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_LIST)) {
    showProvidersListAdmin(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_EDIT)) {
    startEditProvider(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_SCHEDULE)) {
    startProviderSchedule(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_OVERRIDES)) {
    startProviderOverrides(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_DISABLE)) {
    startDisableProvider(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_ENABLE)) {
    startEnableProvider(chatId, settings);
    return;
  }
}

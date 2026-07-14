function getConfigurationMessageMigrationRows() {
  return [
    ['ADMIN_CONFIGURATION', '⚙️ Конфігурація', '⚙️ Конфигурация', '⚙️ Configuration'],
    ['CONFIGURATION_TITLE', 'Налаштування конфігурації', 'Настройки конфигурации', 'Configuration settings'],
    ['CONFIGURATION_LANGUAGE', 'Мова', 'Язык', 'Language'],
    ['CONFIGURATION_ADMIN_IDS', '👤 Адміністратори', '👤 Администраторы', '👤 Administrators'],
    [
      'CONFIGURATION_ADMIN_IDS_PROMPT',
      'Введіть Telegram ID адміністраторів через кому. Ваш ID має залишитися у списку.',
      'Введите Telegram ID администраторов через запятую. Ваш ID должен остаться в списке.',
      'Enter administrator Telegram IDs separated by commas. Your ID must remain in the list.'
    ],
    [
      'CONFIGURATION_ADMIN_IDS_UPDATED',
      'Список адміністраторів оновлено',
      'Список администраторов обновлён',
      'Administrator list updated'
    ],
    [
      'CONFIGURATION_ADMIN_IDS_INVALID',
      'Введіть один або кілька числових Telegram ID через кому',
      'Введите один или несколько числовых Telegram ID через запятую',
      'Enter one or more numeric Telegram IDs separated by commas'
    ],
    [
      'CONFIGURATION_ADMIN_IDS_SELF_REQUIRED',
      'Ваш Telegram ID має залишитися у списку адміністраторів',
      'Ваш Telegram ID должен остаться в списке администраторов',
      'Your Telegram ID must remain in the administrator list'
    ],
    [
      'CONFIGURATION_ADMINS_TITLE',
      'Адміністратори з доступом до бота:',
      'Администраторы с доступом к боту:',
      'Administrators with bot access:'
    ],
    ['CONFIGURATION_ADMIN_ADD', '➕ Додати адміністратора', '➕ Добавить администратора', '➕ Add administrator'],
    [
      'CONFIGURATION_ADMIN_DELETE',
      '➖ Видалити адміністратора',
      '➖ Удалить администратора',
      '➖ Delete administrator'
    ],
    ['CONFIGURATION_ADMIN_LIST', '📋 Список адміністраторів', '📋 Список администраторов', '📋 Administrator list'],
    [
      'CONFIGURATION_ADMIN_ADD_PROMPT',
      'Введіть Telegram ID нового адміністратора. Існуючий список буде збережено.',
      'Введите Telegram ID нового администратора. Существующий список будет сохранён.',
      'Enter the new administrator Telegram ID. The existing list will be preserved.'
    ],
    [
      'CONFIGURATION_ADMIN_DELETE_PROMPT',
      'Введіть Telegram ID адміністратора, якого потрібно видалити. Свій ID видалити не можна. Поточний список:',
      'Введите Telegram ID администратора, которого нужно удалить. Свой ID удалить нельзя. Текущий список:',
      'Enter the administrator Telegram ID to delete. You cannot delete your own ID. Current list:'
    ],
    ['CONFIGURATION_ADMIN_ADDED', 'Адміністратора додано', 'Администратор добавлен', 'Administrator added'],
    ['CONFIGURATION_ADMIN_DELETED', 'Адміністратора видалено', 'Администратор удалён', 'Administrator deleted'],
    [
      'CONFIGURATION_ADMIN_ID_INVALID',
      'Telegram ID має складатися лише з цифр',
      'Telegram ID должен содержать только цифры',
      'Telegram ID must contain digits only'
    ],
    [
      'CONFIGURATION_ADMIN_ALREADY_EXISTS',
      'Цей адміністратор уже є у списку',
      'Этот администратор уже есть в списке',
      'This administrator is already in the list'
    ],
    [
      'CONFIGURATION_ADMIN_NOT_FOUND',
      'Адміністратора з таким ID немає у списку',
      'Администратора с таким ID нет в списке',
      'No administrator with this ID is in the list'
    ],
    [
      'CONFIGURATION_ADMIN_SELF_DELETE_FORBIDDEN',
      'Ви не можете видалити власний ID зі списку адміністраторів',
      'Вы не можете удалить собственный ID из списка администраторов',
      'You cannot delete your own ID from the administrator list'
    ],
    ['CONFIGURATION_REMINDER_DAY_BEFORE', '🔔 Нагадування за день', '🔔 Напоминание за день', '🔔 Day-before reminder'],
    [
      'CONFIGURATION_REMINDER_DAY_BEFORE_TITLE',
      'Нагадування клієнту за день до запису',
      'Напоминание клиенту за день до записи',
      'Customer reminder one day before the appointment'
    ],
    ['CONFIGURATION_CURRENT_STATUS', 'Поточний статус', 'Текущий статус', 'Current status'],
    ['CONFIGURATION_ENABLE', '✅ Увімкнути нагадування', '✅ Включить напоминание', '✅ Enable reminder'],
    ['CONFIGURATION_DISABLE', '⛔ Вимкнути нагадування', '⛔ Выключить напоминание', '⛔ Disable reminder'],
    [
      'CONFIGURATION_REMINDER_ENABLED',
      'Нагадування за день увімкнено',
      'Напоминание за день включено',
      'Day-before reminder enabled'
    ],
    [
      'CONFIGURATION_REMINDER_DISABLED',
      'Нагадування за день вимкнено',
      'Напоминание за день выключено',
      'Day-before reminder disabled'
    ],
    [
      'CONFIGURATION_BOOKING_DAYS',
      '📅 Горизонт онлайн-запису',
      '📅 Горизонт онлайн-записи',
      '📅 Online booking horizon'
    ],
    [
      'CONFIGURATION_BOOKING_DAYS_PROMPT',
      'Введіть кількість днів наперед, доступних клієнту для запису (від 1 до 365)',
      'Введите количество дней вперёд, доступных клиенту для записи (от 1 до 365)',
      'Enter how many days ahead clients can book (1 to 365)'
    ],
    ['CONFIGURATION_CURRENT_VALUE', 'Поточне значення', 'Текущее значение', 'Current value'],
    [
      'CONFIGURATION_DAYS_INVALID',
      'Введіть ціле число від 1 до 365',
      'Введите целое число от 1 до 365',
      'Enter a whole number from 1 to 365'
    ],
    [
      'CONFIGURATION_BOOKING_DAYS_UPDATED',
      'Горизонт онлайн-запису оновлено',
      'Горизонт онлайн-записи обновлён',
      'Online booking horizon updated'
    ],
    ['CONFIGURATION_PAGE_SIZE', '📄 Розмір сторінки', '📄 Размер страницы', '📄 Page size'],
    [
      'CONFIGURATION_PAGE_SIZE_PROMPT',
      'Введіть кількість записів на одній сторінці пагінації (від 1 до 10)',
      'Введите количество записей на одной странице пагинации (от 1 до 10)',
      'Enter the number of items per pagination page (1 to 10)'
    ],
    [
      'CONFIGURATION_PAGE_SIZE_INVALID',
      'Введіть ціле число від 1 до 10',
      'Введите целое число от 1 до 10',
      'Enter a whole number from 1 to 10'
    ],
    ['CONFIGURATION_PAGE_SIZE_UPDATED', 'Розмір сторінки оновлено', 'Размер страницы обновлён', 'Page size updated'],
    [
      'CONFIGURATION_DEFAULT_WORK_HOURS',
      '🕘 Стандартні робочі години',
      '🕘 Стандартные рабочие часы',
      '🕘 Default working hours'
    ],
    [
      'CONFIGURATION_DEFAULT_WORK_HOURS_PROMPT',
      'Введіть стандартний початок і кінець робочого дня у форматі ГГ:ХХ-ГГ:ХХ. Значення застосовуються до нових майстрів і як резервні години; чинні графіки не зміняться.',
      'Введите стандартное начало и конец рабочего дня в формате ЧЧ:ММ-ЧЧ:ММ. Значения применяются к новым мастерам и как резервные часы; действующие графики не изменятся.',
      'Enter the default workday start and end as HH:MM-HH:MM. These values apply to new providers and as fallback hours; existing schedules will not change.'
    ],
    [
      'CONFIGURATION_DEFAULT_WORK_HOURS_INVALID',
      'Введіть час у форматі ГГ:ХХ-ГГ:ХХ, наприклад 09:00-20:00',
      'Введите время в формате ЧЧ:ММ-ЧЧ:ММ, например 09:00-20:00',
      'Enter time as HH:MM-HH:MM, for example 09:00-20:00'
    ],
    [
      'CONFIGURATION_DEFAULT_WORK_HOURS_ORDER_INVALID',
      'Час завершення має бути пізніше часу початку. Введіть нове значення.',
      'Время окончания должно быть позже времени начала. Введите новое значение.',
      'End time must be later than start time. Enter a new value.'
    ],
    [
      'CONFIGURATION_DEFAULT_WORK_HOURS_UPDATED',
      'Стандартні робочі години оновлено',
      'Стандартные рабочие часы обновлены',
      'Default working hours updated'
    ],
    ['CONFIGURATION_SELECT_LANGUAGE', 'Оберіть мову', 'Выберите язык', 'Select language'],
    ['CONFIGURATION_LANGUAGE_UPDATED', 'Мову змінено', 'Язык изменён', 'Language updated'],
    [
      'CONFIGURATION_INVALID_LANGUAGE',
      'Оберіть мову зі списку',
      'Выберите язык из списка',
      'Select a language from the list'
    ],
    ['LANGUAGE_UKRAINIAN', 'Українська', 'Украинский', 'Ukrainian'],
    ['LANGUAGE_RUSSIAN', 'Російська', 'Русский', 'Russian'],
    ['LANGUAGE_ENGLISH', 'Англійська', 'Английский', 'English']
  ];
}

function migrateConfigurationMenuIcon() {
  const values = {
    uk: '⚙️ Конфігурація',
    ru: '⚙️ Конфигурация',
    en: '⚙️ Configuration'
  };

  createOrUpdateMessageValues('ADMIN_CONFIGURATION', values);

  resetMessagesCache();

  const result = {
    migration: 'configuration_menu_icon_v1',
    updated: 1,
    key: 'ADMIN_CONFIGURATION'
  };

  addAuditLog('CONFIGURATION_MENU_ICON_MIGRATION', JSON.stringify(result));

  Logger.log(JSON.stringify(result));
  return result;
}

function migrateConfigurationReminderLabels() {
  createOrUpdateMessageValues('CONFIGURATION_ENABLE', {
    uk: '✅ Увімкнути нагадування',
    ru: '✅ Включить напоминание',
    en: '✅ Enable reminder'
  });

  createOrUpdateMessageValues('CONFIGURATION_DISABLE', {
    uk: '⛔ Вимкнути нагадування',
    ru: '⛔ Выключить напоминание',
    en: '⛔ Disable reminder'
  });

  resetMessagesCache();

  const result = {
    migration: 'configuration_reminder_labels_v1',
    updated: 2,
    keys: ['CONFIGURATION_ENABLE', 'CONFIGURATION_DISABLE']
  };

  addAuditLog('CONFIGURATION_REMINDER_LABELS_MIGRATION', JSON.stringify(result));

  Logger.log(JSON.stringify(result));
  return result;
}

function migratePaginationConfiguration() {
  const messages = {
    CONFIGURATION_PAGE_SIZE: {
      uk: '📄 Розмір сторінки',
      ru: '📄 Размер страницы',
      en: '📄 Page size'
    },
    CONFIGURATION_PAGE_SIZE_PROMPT: {
      uk: 'Введіть кількість записів на одній сторінці пагінації (від 1 до 10)',
      ru: 'Введите количество записей на одной странице пагинации (от 1 до 10)',
      en: 'Enter the number of items per pagination page (1 to 10)'
    },
    CONFIGURATION_PAGE_SIZE_INVALID: {
      uk: 'Введіть ціле число від 1 до 10',
      ru: 'Введите целое число от 1 до 10',
      en: 'Enter a whole number from 1 to 10'
    },
    CONFIGURATION_PAGE_SIZE_UPDATED: {
      uk: 'Розмір сторінки оновлено',
      ru: 'Размер страницы обновлён',
      en: 'Page size updated'
    }
  };

  Object.keys(messages).forEach(function (key) {
    createOrUpdateMessageValues(key, messages[key]);
  });

  const settings = getSettings();
  const currentValue = Number(settings.PaginationPageSize);
  let settingValue = currentValue;

  if (!Number.isInteger(currentValue) || currentValue < 1 || currentValue > 10) {
    settingValue = 5;
    updateSettingValue('PaginationPageSize', settingValue);
  }

  resetMessagesCache();

  const result = {
    migration: 'pagination_configuration_v1',
    updatedMessageKeys: Object.keys(messages),
    pageSize: settingValue
  };

  addAuditLog('PAGINATION_CONFIGURATION_MIGRATED', JSON.stringify(result));
  Logger.log(JSON.stringify(result));

  return result;
}

function migrateConfigurationMessages() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.MESSAGES);

  if (!sheet) {
    throw new Error('Messages sheet not found');
  }

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });
  const expectedHeaders = ['key', 'uk', 'ru', 'en'];

  expectedHeaders.forEach(function (header) {
    if (headers.indexOf(header) === -1) {
      throw new Error('Messages sheet is missing column: ' + header);
    }
  });

  const keyIndex = headers.indexOf('key');
  const existingKeys = {};

  for (let i = 1; i < rows.length; i++) {
    const key = String(rows[i][keyIndex] || '').trim();
    if (key) {
      existingKeys[key] = true;
    }
  }

  const migrationRows = getConfigurationMessageMigrationRows();
  const rowsToAppend = [];
  const skippedKeys = [];

  migrationRows.forEach(function (sourceRow) {
    const key = sourceRow[0];

    if (existingKeys[key]) {
      skippedKeys.push(key);
      return;
    }

    const valuesByHeader = {
      key: sourceRow[0],
      uk: sourceRow[1],
      ru: sourceRow[2],
      en: sourceRow[3]
    };

    rowsToAppend.push(
      headers.map(function (header) {
        return valuesByHeader[header] || '';
      })
    );
  });

  if (rowsToAppend.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAppend.length, headers.length).setValues(rowsToAppend);
  }

  resetMessagesCache();

  const result = {
    migration: 'configuration_messages_v1',
    added: rowsToAppend.length,
    skipped: skippedKeys.length,
    addedKeys: rowsToAppend.map(function (row) {
      return row[keyIndex];
    }),
    skippedKeys: skippedKeys
  };

  addAuditLog('CONFIGURATION_MESSAGES_MIGRATION', JSON.stringify(result));

  Logger.log(JSON.stringify(result));
  return result;
}

function migrateCalendarResilienceMessages() {
  createOrUpdateMessageValues('REQUEST_CALENDAR_ERROR', {
    uk: 'Не вдалося створити подію в календарі. Перевірте доступ до календаря майстра та повторіть підтвердження заявки.',
    ru: 'Не удалось создать событие в календаре. Проверьте доступ к календарю мастера и повторите подтверждение заявки.',
    en: 'Could not create the Calendar event. Check access to the provider calendar and confirm the request again.'
  });

  createOrUpdateMessageValues('APPOINTMENT_CALENDAR_ERROR', {
    uk: 'Не вдалося оновити запис у календарі. Час запису не змінено. Спробуйте ще раз пізніше або зв’яжіться із салоном.',
    ru: 'Не удалось обновить запись в календаре. Время записи не изменено. Попробуйте ещё раз позже или свяжитесь с салоном.',
    en: 'Could not update the appointment in Calendar. The appointment time was not changed. Try again later or contact the salon.'
  });

  resetMessagesCache();

  const result = { migration: 'calendar_resilience_messages_v1', updated: 2 };

  addAuditLog('CALENDAR_RESILIENCE_MESSAGES_MIGRATION', JSON.stringify(result));
  Logger.log(JSON.stringify(result));
  return result;
}

function migrateSystemConfigurationSettings() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.SETTINGS);

  if (!sheet) {
    throw new Error('Settings sheet not found');
  }

  const rows = sheet.getDataRange().getValues();
  const obsoleteKeys = {
    OwnerTelegramId: true,
    ReminderMonth: true,
    EnableLogs: true
  };
  const deletedKeys = [];

  for (let i = rows.length - 1; i >= 1; i--) {
    const key = String(rows[i][0] || '').trim();

    if (obsoleteKeys[key]) {
      sheet.deleteRow(i + 1);
      deletedKeys.push(key);
    }
  }

  resetSettingsCache();

  const result = {
    migration: 'system_configuration_settings_v1',
    deletedKeys: deletedKeys.sort()
  };

  addAuditLog('SYSTEM_CONFIGURATION_SETTINGS_MIGRATED', JSON.stringify(result));

  Logger.log(JSON.stringify(result));

  return result;
}

function migrateRemoveCalendarCache() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const obsoleteMessageKeys = [
    'CONFIGURATION_CACHE_DAYS',
    'CONFIGURATION_CACHE_DAYS_PROMPT',
    'CONFIGURATION_BOOKING_EXCEEDS_CACHE',
    'CONFIGURATION_CACHE_BELOW_BOOKING',
    'CONFIGURATION_CACHE_DAYS_UPDATED'
  ];
  const obsoleteTriggerHandlers = {
    syncCalendarCacheNearDatesTrigger: true,
    syncCalendarCacheLongRangeTrigger: true
  };
  const deletedTriggers = [];
  let visitSyncTriggerExists = false;

  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    const handler = trigger.getHandlerFunction();

    if (obsoleteTriggerHandlers[handler]) {
      ScriptApp.deleteTrigger(trigger);
      deletedTriggers.push(handler);
      return;
    }

    if (handler === 'syncCompletedCustomerVisitsTrigger') {
      visitSyncTriggerExists = true;
    }
  });

  if (!visitSyncTriggerExists) {
    ScriptApp.newTrigger('syncCompletedCustomerVisitsTrigger').timeBased().everyHours(1).create();
  }

  const deletedSettings = deleteSheetRowsByFirstColumnValue(spreadsheet.getSheetByName(SHEET_NAMES.SETTINGS), [
    'CalendarCacheDays'
  ]);
  const deletedMessages = deleteSheetRowsByFirstColumnValue(
    spreadsheet.getSheetByName(SHEET_NAMES.MESSAGES),
    obsoleteMessageKeys
  );
  const obsoleteSheetName = ['Calendar', 'Cache'].join('');
  const calendarCacheSheet = spreadsheet.getSheetByName(obsoleteSheetName);
  const deletedSheet = Boolean(calendarCacheSheet);

  if (calendarCacheSheet) {
    spreadsheet.deleteSheet(calendarCacheSheet);
  }

  resetSettingsCache();
  resetMessagesCache();

  const result = {
    migration: 'remove_calendar_cache_v1',
    deletedSettings: deletedSettings,
    deletedMessages: deletedMessages,
    deletedTriggers: deletedTriggers.sort(),
    createdVisitSyncTrigger: !visitSyncTriggerExists,
    deletedSheet: deletedSheet
  };

  addAuditLog('CALENDAR_CACHE_REMOVED', JSON.stringify(result));
  Logger.log(JSON.stringify(result));

  return result;
}

function deleteSheetColumnsByHeader(sheet, headerNames) {
  if (!sheet || sheet.getLastColumn() === 0) {
    return [];
  }

  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(function (header) {
      return String(header || '').trim();
    });
  const deletedHeaders = [];

  for (let i = headers.length - 1; i >= 0; i--) {
    if (headerNames.indexOf(headers[i]) === -1) {
      continue;
    }

    sheet.deleteColumn(i + 1);
    deletedHeaders.push(headers[i]);
  }

  return deletedHeaders.reverse();
}

function deleteSheetRowsByFirstColumnValue(sheet, valuesToDelete) {
  if (!sheet || sheet.getLastRow() < 2) {
    return [];
  }

  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  const deletedValues = [];

  for (let i = values.length - 1; i >= 0; i--) {
    const value = String(values[i][0] || '').trim();

    if (valuesToDelete.indexOf(value) === -1) {
      continue;
    }

    sheet.deleteRow(i + 2);
    deletedValues.push(value);
  }

  return deletedValues.reverse();
}

function removeFinancialValuesFromUserSessions(sheet) {
  if (!sheet || sheet.getLastRow() < 2) {
    return 0;
  }

  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(function (header) {
      return String(header || '').trim();
    });
  const sessionDataIndex = headers.indexOf('session_data');

  if (sessionDataIndex === -1) {
    return 0;
  }

  const range = sheet.getRange(2, sessionDataIndex + 1, sheet.getLastRow() - 1, 1);
  const values = range.getValues();
  let updatedCount = 0;

  values.forEach(function (row) {
    const text = String(row[0] || '').trim();

    if (!text) {
      return;
    }

    try {
      const data = JSON.parse(text);
      let changed = false;

      ['service_price_min', 'service_price_max', 'customer_service_price'].forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          delete data[key];
          changed = true;
        }
      });

      if (changed) {
        row[0] = JSON.stringify(data);
        updatedCount++;
      }
    } catch (error) {
      // Preserve malformed legacy session data instead of risking data loss.
    }
  });

  if (updatedCount > 0) {
    range.setValues(values);
  }

  return updatedCount;
}

function migrateRemoveFinancialFields() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const deleted = {};

  deleted.Settings = deleteSheetRowsByFirstColumnValue(spreadsheet.getSheetByName(SHEET_NAMES.SETTINGS), [
    'BusinessName',
    'Currency'
  ]);

  deleted.Messages = deleteSheetRowsByFirstColumnValue(spreadsheet.getSheetByName(SHEET_NAMES.MESSAGES), [
    'PRICES',
    'ENTER_SERVICE_PRICE_MIN',
    'ENTER_SERVICE_PRICE_MAX',
    'SERVICE_PRICE_LABEL',
    'SERVICE_FIELD_PRICE_MIN',
    'SERVICE_FIELD_PRICE_MAX',
    'BASE_PRICE_LABEL',
    'CUSTOM_PRICE_LABEL',
    'ENTER_CUSTOM_PRICE',
    'CUSTOMER_SERVICE_PRICE'
  ]);

  deleted.Services = deleteSheetColumnsByHeader(spreadsheet.getSheetByName(SHEET_NAMES.SERVICES), [
    'price_min',
    'price_max'
  ]);

  deleted.CustomerServiceSettings = deleteSheetColumnsByHeader(
    spreadsheet.getSheetByName(SHEET_NAMES.CUSTOMER_SERVICE_SETTINGS),
    ['price']
  );

  const userSessionsSheet = spreadsheet.getSheetByName(SHEET_NAMES.USER_SESSIONS);

  deleted.UserSessionValues = removeFinancialValuesFromUserSessions(userSessionsSheet);

  deleted.UserSessions = deleteSheetColumnsByHeader(userSessionsSheet, [
    'service_price_min',
    'service_price_max',
    'customer_service_price'
  ]);

  resetSettingsCache();
  resetMessagesCache();
  SERVICES_CACHE = null;
  SERVICES_INCLUDING_INACTIVE_CACHE = null;

  addAuditLog('FINANCIAL_FIELDS_REMOVED', JSON.stringify(deleted));

  Logger.log(JSON.stringify(deleted));

  return deleted;
}

function getEntityMessageValuesByKey(messagesSheet) {
  const rows = messagesSheet.getDataRange().getValues();
  const headers = rows[0].map(function (header) {
    return String(header || '').trim();
  });
  const keyIndex = headers.indexOf('key');
  const settings = getSettings();
  const selectedLanguage = String(settings.Language || 'ru').trim();
  const languageOrder = [selectedLanguage, 'ru', 'uk', 'en'].filter(function (language, index, languages) {
    return languages.indexOf(language) === index;
  });
  const valuesByKey = {};

  if (keyIndex === -1) {
    throw new Error('Messages sheet is missing column: key');
  }

  for (let i = 1; i < rows.length; i++) {
    const key = String(rows[i][keyIndex] || '').trim();

    if (!key) {
      continue;
    }

    let value = '';

    for (let j = 0; j < languageOrder.length; j++) {
      const languageIndex = headers.indexOf(languageOrder[j]);

      if (languageIndex === -1) {
        continue;
      }

      value = String(rows[i][languageIndex] || '').trim();

      if (value) {
        break;
      }
    }

    valuesByKey[key] = value;
  }

  return valuesByKey;
}

function migrateEntityColumnFromMessages(sheet, keyHeader, valueHeader, valuesByKey, migratedKeys) {
  if (!sheet) {
    throw new Error('Entity sheet not found for column: ' + keyHeader);
  }

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(function (header) {
    return String(header || '').trim();
  });
  const keyIndex = headers.indexOf(keyHeader);
  const valueIndex = headers.indexOf(valueHeader);

  if (keyIndex === -1) {
    if (valueIndex === -1) {
      throw new Error(sheet.getName() + ' sheet is missing column: ' + valueHeader);
    }

    return 0;
  }

  if (valueIndex !== -1 && valueIndex !== keyIndex) {
    throw new Error(sheet.getName() + ' sheet contains both ' + keyHeader + ' and ' + valueHeader);
  }

  const migratedValues = [];

  for (let i = 1; i < rows.length; i++) {
    const key = String(rows[i][keyIndex] || '').trim();
    let value = key;

    if (key && Object.prototype.hasOwnProperty.call(valuesByKey, key)) {
      value = valuesByKey[key];

      if (!value) {
        throw new Error('No localized value found for message key: ' + key);
      }

      migratedKeys[key] = true;
    } else if (/^(?:LOCATION_(?:NAME|ADDRESS)|PROVIDER_NAME|SERVICE_NAME)_/.test(key)) {
      throw new Error('Message row not found for entity key: ' + key);
    }

    migratedValues.push([value]);
  }

  if (migratedValues.length > 0) {
    sheet.getRange(2, keyIndex + 1, migratedValues.length, 1).setValues(migratedValues);
  }

  sheet.getRange(1, keyIndex + 1).setValue(valueHeader);

  return migratedValues.length;
}

function validateEntityMigrationColumn(sheet, keyHeader, valueHeader) {
  if (!sheet) {
    throw new Error('Entity sheet not found for column: ' + keyHeader);
  }

  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(function (header) {
      return String(header || '').trim();
    });
  const keyIndex = headers.indexOf(keyHeader);
  const valueIndex = headers.indexOf(valueHeader);

  if (keyIndex === -1 && valueIndex === -1) {
    throw new Error(sheet.getName() + ' sheet is missing column: ' + valueHeader);
  }

  if (keyIndex !== -1 && valueIndex !== -1 && keyIndex !== valueIndex) {
    throw new Error(sheet.getName() + ' sheet contains both ' + keyHeader + ' and ' + valueHeader);
  }
}

function validateEntityMigrationValues(sheet, keyHeader, valuesByKey) {
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(function (header) {
    return String(header || '').trim();
  });
  const keyIndex = headers.indexOf(keyHeader);

  if (keyIndex === -1) {
    return;
  }

  for (let i = 1; i < rows.length; i++) {
    const key = String(rows[i][keyIndex] || '').trim();

    if (!/^(?:LOCATION_(?:NAME|ADDRESS)|PROVIDER_NAME|SERVICE_NAME)_/.test(key)) {
      continue;
    }

    if (!Object.prototype.hasOwnProperty.call(valuesByKey, key) || !String(valuesByKey[key] || '').trim()) {
      throw new Error('Localized value not found for entity key: ' + key);
    }
  }
}

function deleteMigratedEntityMessages(messagesSheet, migratedKeys) {
  if (messagesSheet.getLastRow() < 2) {
    return [];
  }

  const headers = messagesSheet
    .getRange(1, 1, 1, messagesSheet.getLastColumn())
    .getValues()[0]
    .map(function (header) {
      return String(header || '').trim();
    });
  const keyIndex = headers.indexOf('key');

  if (keyIndex === -1) {
    throw new Error('Messages sheet is missing column: key');
  }

  const keys = messagesSheet.getRange(2, keyIndex + 1, messagesSheet.getLastRow() - 1, 1).getValues();
  const deletedKeys = [];

  for (let i = keys.length - 1; i >= 0; i--) {
    const key = String(keys[i][0] || '').trim();

    if (!migratedKeys[key]) {
      continue;
    }

    messagesSheet.deleteRow(i + 2);
    deletedKeys.push(key);
  }

  return deletedKeys.reverse();
}

function migrateEntityNamesFromMessages() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const messagesSheet = spreadsheet.getSheetByName(SHEET_NAMES.MESSAGES);

  if (!messagesSheet) {
    throw new Error('Messages sheet not found');
  }

  const valuesByKey = getEntityMessageValuesByKey(messagesSheet);
  const migratedKeys = {};
  const locationsSheet = spreadsheet.getSheetByName(SHEET_NAMES.LOCATIONS);
  const providersSheet = spreadsheet.getSheetByName(SHEET_NAMES.PROVIDERS);
  const servicesSheet = spreadsheet.getSheetByName(SHEET_NAMES.SERVICES);

  validateEntityMigrationColumn(locationsSheet, 'name_key', 'name');
  validateEntityMigrationColumn(locationsSheet, 'address_key', 'address');
  validateEntityMigrationColumn(providersSheet, 'name_key', 'name');
  validateEntityMigrationColumn(servicesSheet, 'name_key', 'name');
  validateEntityMigrationValues(locationsSheet, 'name_key', valuesByKey);
  validateEntityMigrationValues(locationsSheet, 'address_key', valuesByKey);
  validateEntityMigrationValues(providersSheet, 'name_key', valuesByKey);
  validateEntityMigrationValues(servicesSheet, 'name_key', valuesByKey);

  const migratedRows = {
    LocationsName: migrateEntityColumnFromMessages(locationsSheet, 'name_key', 'name', valuesByKey, migratedKeys),
    LocationsAddress: migrateEntityColumnFromMessages(
      locationsSheet,
      'address_key',
      'address',
      valuesByKey,
      migratedKeys
    ),
    ProvidersName: migrateEntityColumnFromMessages(providersSheet, 'name_key', 'name', valuesByKey, migratedKeys),
    ServicesName: migrateEntityColumnFromMessages(servicesSheet, 'name_key', 'name', valuesByKey, migratedKeys)
  };
  const deletedMessageKeys = deleteMigratedEntityMessages(messagesSheet, migratedKeys);
  const result = {
    migration: 'entity_names_from_messages_v1',
    migratedRows: migratedRows,
    deletedMessageKeys: deletedMessageKeys
  };

  resetMessagesCache();
  resetLocationsCache();
  PROVIDERS_CACHE = null;
  PROVIDERS_INCLUDING_INACTIVE_CACHE = null;
  SERVICES_CACHE = null;
  SERVICES_INCLUDING_INACTIVE_CACHE = null;

  addAuditLog('ENTITY_NAMES_MIGRATED', JSON.stringify(result));
  Logger.log(JSON.stringify(result));

  return result;
}

function migrateCleanupLegacyWorkbookSchema() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const auditLogSheet = spreadsheet.getSheetByName(SHEET_NAMES.AUDIT_LOG);
  const messagesSheet = spreadsheet.getSheetByName(SHEET_NAMES.MESSAGES);
  const sessionsSheet = spreadsheet.getSheetByName(SHEET_NAMES.USER_SESSIONS);

  if (!auditLogSheet || !messagesSheet || !sessionsSheet) {
    throw new Error('Required workbook sheet not found');
  }

  const auditLogHeaderCreated = ensureAuditLogHeaders(auditLogSheet);
  const deletedMessageColumns = deleteBlankMessageColumns(messagesSheet);
  const sessionResult = migrateLegacyUserSessions(sessionsSheet);
  const deletedSheets = [];
  const obsoleteSheets = [['Provider', 'Services'].join(''), ['Notifi', 'cations'].join('')];

  obsoleteSheets.forEach(function (sheetName) {
    const sheet = spreadsheet.getSheetByName(sheetName);

    if (sheet) {
      spreadsheet.deleteSheet(sheet);
      deletedSheets.push(sheetName);
    }
  });

  const result = {
    migration: 'cleanup_legacy_workbook_schema_v1',
    auditLogHeaderCreated: auditLogHeaderCreated,
    deletedMessageColumns: deletedMessageColumns,
    migratedSessionRows: sessionResult.migratedRows,
    deletedSessionColumns: sessionResult.deletedColumns,
    deletedSheets: deletedSheets
  };

  addAuditLog('LEGACY_WORKBOOK_SCHEMA_CLEANED', JSON.stringify(result));
  Logger.log(JSON.stringify(result));
  return result;
}

function ensureAuditLogHeaders(sheet) {
  const expected = ['timestamp', 'action', 'details'];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, expected.length).setValues([expected]);
    return true;
  }

  const current = sheet
    .getRange(1, 1, 1, expected.length)
    .getValues()[0]
    .map(function (value) {
      return String(value || '').trim();
    });

  if (current.join('|') === expected.join('|')) {
    return false;
  }

  if (!current.some(function (value) { return value; })) {
    sheet.getRange(1, 1, 1, expected.length).setValues([expected]);
    return true;
  }

  sheet.insertRowBefore(1);
  sheet.getRange(1, 1, 1, expected.length).setValues([expected]);
  return true;
}

function getBlankColumnIndexes(rows, protectedColumnCount) {
  if (!rows.length) {
    return [];
  }

  const result = [];

  for (let columnIndex = protectedColumnCount; columnIndex < rows[0].length; columnIndex++) {
    const isBlank = rows.every(function (row) {
      return String(row[columnIndex] || '').trim() === '';
    });

    if (isBlank) {
      result.push(columnIndex);
    }
  }

  return result;
}

function deleteBlankMessageColumns(sheet) {
  const indexes = getBlankColumnIndexes(sheet.getDataRange().getValues(), 4);

  for (let i = indexes.length - 1; i >= 0; i--) {
    sheet.deleteColumn(indexes[i] + 1);
  }

  return indexes.map(function (index) { return index + 1; });
}

function buildMigratedSessionData(headers, row) {
  const sessionDataIndex = headers.indexOf('session_data');

  if (sessionDataIndex === -1) {
    throw new Error('UserSessions sheet is missing column: session_data');
  }

  const jsonText = String(row[sessionDataIndex] || '').trim();
  const sessionData = jsonText ? JSON.parse(jsonText) : {};
  const protectedHeaders = { telegram_id: true, session_data: true, updated_at: true };
  let changed = false;

  headers.forEach(function (header, index) {
    const value = row[index];

    if (!header || protectedHeaders[header] || value === '' || value === null || value === undefined) {
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(sessionData, header)) {
      sessionData[header] = value;
      changed = true;
    }
  });

  return { changed: changed, jsonText: JSON.stringify(sessionData) };
}

function migrateLegacyUserSessions(sheet) {
  const rows = sheet.getDataRange().getValues();

  if (!rows.length) {
    throw new Error('UserSessions sheet is empty');
  }

  const headers = rows[0].map(function (header) { return String(header || '').trim(); });
  const requiredHeaders = ['telegram_id', 'session_data', 'updated_at'];

  requiredHeaders.forEach(function (header) {
    if (headers.indexOf(header) === -1) {
      throw new Error('UserSessions sheet is missing column: ' + header);
    }
  });

  const sessionDataIndex = headers.indexOf('session_data');
  let migratedRows = 0;

  for (let i = 1; i < rows.length; i++) {
    const migrated = buildMigratedSessionData(headers, rows[i]);

    if (migrated.changed) {
      sheet.getRange(i + 1, sessionDataIndex + 1).setValue(migrated.jsonText);
      migratedRows++;
    }
  }

  const deletedColumns = [];

  for (let i = headers.length - 1; i >= 0; i--) {
    if (requiredHeaders.indexOf(headers[i]) === -1) {
      sheet.deleteColumn(i + 1);
      deletedColumns.push(headers[i] || 'column_' + String(i + 1));
    }
  }

  return { migratedRows: migratedRows, deletedColumns: deletedColumns.reverse() };
}

function isMigratableBotToken(value) {
  const token = String(value || '').trim();
  return /^\d+:[A-Za-z0-9_-]{20,}$/.test(token);
}

function getBotTokenSettingRows(sheet) {
  const rows = sheet.getDataRange().getValues();
  const result = {};

  for (let i = 1; i < rows.length; i++) {
    const key = String(rows[i][0] || '').trim();

    if (Object.prototype.hasOwnProperty.call(BOT_TOKEN_PROPERTY_KEYS, key)) {
      result[key] = { row: i + 1, value: String(rows[i][1] || '').trim() };
    }
  }

  return result;
}

function migrateBotTokensToScriptProperties() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.SETTINGS);

    if (!sheet) {
      throw new Error('Settings sheet not found');
    }

    const properties = PropertiesService.getScriptProperties();
    const settingRows = getBotTokenSettingRows(sheet);
    const tokens = {};

    Object.keys(BOT_TOKEN_PROPERTY_KEYS).forEach(function (settingKey) {
      const storedToken = String(properties.getProperty(BOT_TOKEN_PROPERTY_KEYS[settingKey]) || '').trim();
      const sheetToken = settingRows[settingKey] ? settingRows[settingKey].value : '';
      const token = storedToken || sheetToken;

      if (!isMigratableBotToken(token)) {
        throw new Error(settingKey + ' is missing or invalid');
      }

      tokens[settingKey] = token;
    });

    Object.keys(BOT_TOKEN_PROPERTY_KEYS).forEach(function (settingKey) {
      properties.setProperty(BOT_TOKEN_PROPERTY_KEYS[settingKey], tokens[settingKey]);
    });

    Object.keys(BOT_TOKEN_PROPERTY_KEYS).forEach(function (settingKey) {
      if (settingRows[settingKey] && settingRows[settingKey].value) {
        sheet.getRange(settingRows[settingKey].row, 2).clearContent();
      }
    });

    SpreadsheetApp.flush();
    resetSettingsCache();

    const result = { migration: 'bot_tokens_to_script_properties_v1', migrated: true, clearedSettings: true };
    addAuditLog('MIGRATION_COMPLETE', JSON.stringify(result));
    Logger.log(JSON.stringify(result));
    return result;
  } finally {
    lock.releaseLock();
  }
}

function migrateRemoveLegacyBotTokenSettings() {
  const properties = PropertiesService.getScriptProperties();

  Object.keys(BOT_TOKEN_PROPERTY_KEYS).forEach(function (settingKey) {
    const token = properties.getProperty(BOT_TOKEN_PROPERTY_KEYS[settingKey]);

    if (!isMigratableBotToken(token)) {
      throw new Error(BOT_TOKEN_PROPERTY_KEYS[settingKey] + ' is missing or invalid');
    }
  });

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.SETTINGS);

  if (!sheet) {
    throw new Error('Settings sheet not found');
  }

  const deletedRows = deleteSheetRowsByFirstColumnValue(sheet, Object.keys(BOT_TOKEN_PROPERTY_KEYS));
  resetSettingsCache();

  const result = { migration: 'remove_legacy_bot_token_settings_v1', deletedRows: deletedRows };
  addAuditLog('MIGRATION_COMPLETE', JSON.stringify(result));
  Logger.log(JSON.stringify(result));
  return result;
}

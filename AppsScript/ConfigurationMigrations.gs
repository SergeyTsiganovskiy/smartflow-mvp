function getConfigurationMessageMigrationRows() {
  return [
    ['ADMIN_CONFIGURATION', '⚙️ Конфігурація', '⚙️ Конфигурация', '⚙️ Configuration'],
    ['CONFIGURATION_TITLE', 'Налаштування конфігурації', 'Настройки конфигурации', 'Configuration settings'],
    ['CONFIGURATION_LANGUAGE', 'Мова', 'Язык', 'Language'],
    ['CONFIGURATION_ADMIN_IDS', '👤 Адміністратори', '👤 Администраторы', '👤 Administrators'],
    ['CONFIGURATION_ADMIN_IDS_PROMPT', 'Введіть Telegram ID адміністраторів через кому. Ваш ID має залишитися у списку.', 'Введите Telegram ID администраторов через запятую. Ваш ID должен остаться в списке.', 'Enter administrator Telegram IDs separated by commas. Your ID must remain in the list.'],
    ['CONFIGURATION_ADMIN_IDS_UPDATED', 'Список адміністраторів оновлено', 'Список администраторов обновлён', 'Administrator list updated'],
    ['CONFIGURATION_ADMIN_IDS_INVALID', 'Введіть один або кілька числових Telegram ID через кому', 'Введите один или несколько числовых Telegram ID через запятую', 'Enter one or more numeric Telegram IDs separated by commas'],
    ['CONFIGURATION_ADMIN_IDS_SELF_REQUIRED', 'Ваш Telegram ID має залишитися у списку адміністраторів', 'Ваш Telegram ID должен остаться в списке администраторов', 'Your Telegram ID must remain in the administrator list'],
    ['CONFIGURATION_ADMINS_TITLE', 'Адміністратори з доступом до бота:', 'Администраторы с доступом к боту:', 'Administrators with bot access:'],
    ['CONFIGURATION_ADMIN_ADD', '➕ Додати адміністратора', '➕ Добавить администратора', '➕ Add administrator'],
    ['CONFIGURATION_ADMIN_DELETE', '➖ Видалити адміністратора', '➖ Удалить администратора', '➖ Delete administrator'],
    ['CONFIGURATION_ADMIN_LIST', '📋 Список адміністраторів', '📋 Список администраторов', '📋 Administrator list'],
    ['CONFIGURATION_ADMIN_ADD_PROMPT', 'Введіть Telegram ID нового адміністратора. Існуючий список буде збережено.', 'Введите Telegram ID нового администратора. Существующий список будет сохранён.', 'Enter the new administrator Telegram ID. The existing list will be preserved.'],
    ['CONFIGURATION_ADMIN_DELETE_PROMPT', 'Введіть Telegram ID адміністратора, якого потрібно видалити. Свій ID видалити не можна. Поточний список:', 'Введите Telegram ID администратора, которого нужно удалить. Свой ID удалить нельзя. Текущий список:', 'Enter the administrator Telegram ID to delete. You cannot delete your own ID. Current list:'],
    ['CONFIGURATION_ADMIN_ADDED', 'Адміністратора додано', 'Администратор добавлен', 'Administrator added'],
    ['CONFIGURATION_ADMIN_DELETED', 'Адміністратора видалено', 'Администратор удалён', 'Administrator deleted'],
    ['CONFIGURATION_ADMIN_ID_INVALID', 'Telegram ID має складатися лише з цифр', 'Telegram ID должен содержать только цифры', 'Telegram ID must contain digits only'],
    ['CONFIGURATION_ADMIN_ALREADY_EXISTS', 'Цей адміністратор уже є у списку', 'Этот администратор уже есть в списке', 'This administrator is already in the list'],
    ['CONFIGURATION_ADMIN_NOT_FOUND', 'Адміністратора з таким ID немає у списку', 'Администратора с таким ID нет в списке', 'No administrator with this ID is in the list'],
    ['CONFIGURATION_ADMIN_SELF_DELETE_FORBIDDEN', 'Ви не можете видалити власний ID зі списку адміністраторів', 'Вы не можете удалить собственный ID из списка администраторов', 'You cannot delete your own ID from the administrator list'],
    ['CONFIGURATION_REMINDER_DAY_BEFORE', '🔔 Нагадування за день', '🔔 Напоминание за день', '🔔 Day-before reminder'],
    ['CONFIGURATION_REMINDER_DAY_BEFORE_TITLE', 'Нагадування клієнту за день до запису', 'Напоминание клиенту за день до записи', 'Customer reminder one day before the appointment'],
    ['CONFIGURATION_CURRENT_STATUS', 'Поточний статус', 'Текущий статус', 'Current status'],
    ['CONFIGURATION_ENABLE', '✅ Увімкнути нагадування', '✅ Включить напоминание', '✅ Enable reminder'],
    ['CONFIGURATION_DISABLE', '⛔ Вимкнути нагадування', '⛔ Выключить напоминание', '⛔ Disable reminder'],
    ['CONFIGURATION_REMINDER_ENABLED', 'Нагадування за день увімкнено', 'Напоминание за день включено', 'Day-before reminder enabled'],
    ['CONFIGURATION_REMINDER_DISABLED', 'Нагадування за день вимкнено', 'Напоминание за день выключено', 'Day-before reminder disabled'],
    ['CONFIGURATION_BOOKING_DAYS', '📅 Горизонт онлайн-запису', '📅 Горизонт онлайн-записи', '📅 Online booking horizon'],
    ['CONFIGURATION_CACHE_DAYS', '🗓 Горизонт кешу календаря', '🗓 Горизонт кеша календаря', '🗓 Calendar cache horizon'],
    ['CONFIGURATION_BOOKING_DAYS_PROMPT', 'Введіть кількість днів наперед, доступних клієнту для запису (від 1 до 365)', 'Введите количество дней вперёд, доступных клиенту для записи (от 1 до 365)', 'Enter how many days ahead clients can book (1 to 365)'],
    ['CONFIGURATION_CACHE_DAYS_PROMPT', 'Введіть кількість днів для кешу календаря (від 1 до 365)', 'Введите количество дней для кеша календаря (от 1 до 365)', 'Enter the Calendar cache horizon in days (1 to 365)'],
    ['CONFIGURATION_CURRENT_VALUE', 'Поточне значення', 'Текущее значение', 'Current value'],
    ['CONFIGURATION_DAYS_INVALID', 'Введіть ціле число від 1 до 365', 'Введите целое число от 1 до 365', 'Enter a whole number from 1 to 365'],
    ['CONFIGURATION_BOOKING_EXCEEDS_CACHE', 'Горизонт запису не може перевищувати горизонт кешу календаря. Введіть нове значення не більше', 'Горизонт записи не может превышать горизонт кеша календаря. Введите новое значение не больше', 'Booking horizon cannot exceed the Calendar cache horizon. Enter a new value no greater than'],
    ['CONFIGURATION_CACHE_BELOW_BOOKING', 'Горизонт кешу не може бути меншим за горизонт онлайн-запису. Введіть нове значення не менше', 'Горизонт кеша не может быть меньше горизонта онлайн-записи. Введите новое значение не меньше', 'Calendar cache horizon cannot be shorter than the booking horizon. Enter a new value no less than'],
    ['CONFIGURATION_BOOKING_DAYS_UPDATED', 'Горизонт онлайн-запису оновлено', 'Горизонт онлайн-записи обновлён', 'Online booking horizon updated'],
    ['CONFIGURATION_CACHE_DAYS_UPDATED', 'Горизонт кешу календаря оновлено', 'Горизонт кеша календаря обновлён', 'Calendar cache horizon updated'],
    ['CONFIGURATION_DEFAULT_WORK_HOURS', '🕘 Стандартні робочі години', '🕘 Стандартные рабочие часы', '🕘 Default working hours'],
    ['CONFIGURATION_DEFAULT_WORK_HOURS_PROMPT', 'Введіть стандартний початок і кінець робочого дня у форматі ГГ:ХХ-ГГ:ХХ. Значення застосовуються до нових майстрів і як резервні години; чинні графіки не зміняться.', 'Введите стандартное начало и конец рабочего дня в формате ЧЧ:ММ-ЧЧ:ММ. Значения применяются к новым мастерам и как резервные часы; действующие графики не изменятся.', 'Enter the default workday start and end as HH:MM-HH:MM. These values apply to new providers and as fallback hours; existing schedules will not change.'],
    ['CONFIGURATION_DEFAULT_WORK_HOURS_INVALID', 'Введіть час у форматі ГГ:ХХ-ГГ:ХХ, наприклад 09:00-20:00', 'Введите время в формате ЧЧ:ММ-ЧЧ:ММ, например 09:00-20:00', 'Enter time as HH:MM-HH:MM, for example 09:00-20:00'],
    ['CONFIGURATION_DEFAULT_WORK_HOURS_ORDER_INVALID', 'Час завершення має бути пізніше часу початку. Введіть нове значення.', 'Время окончания должно быть позже времени начала. Введите новое значение.', 'End time must be later than start time. Enter a new value.'],
    ['CONFIGURATION_DEFAULT_WORK_HOURS_UPDATED', 'Стандартні робочі години оновлено', 'Стандартные рабочие часы обновлены', 'Default working hours updated'],
    ['CONFIGURATION_SELECT_LANGUAGE', 'Оберіть мову', 'Выберите язык', 'Select language'],
    ['CONFIGURATION_LANGUAGE_UPDATED', 'Мову змінено', 'Язык изменён', 'Language updated'],
    ['CONFIGURATION_INVALID_LANGUAGE', 'Оберіть мову зі списку', 'Выберите язык из списка', 'Select a language from the list'],
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

  createOrUpdateMessageValues(
    'ADMIN_CONFIGURATION',
    values
  );

  resetMessagesCache();

  const result = {
    migration: 'configuration_menu_icon_v1',
    updated: 1,
    key: 'ADMIN_CONFIGURATION'
  };

  addAuditLog(
    'CONFIGURATION_MENU_ICON_MIGRATION',
    JSON.stringify(result)
  );

  Logger.log(JSON.stringify(result));
  return result;
}

function migrateConfigurationReminderLabels() {
  createOrUpdateMessageValues(
    'CONFIGURATION_ENABLE',
    {
      uk: '✅ Увімкнути нагадування',
      ru: '✅ Включить напоминание',
      en: '✅ Enable reminder'
    }
  );

  createOrUpdateMessageValues(
    'CONFIGURATION_DISABLE',
    {
      uk: '⛔ Вимкнути нагадування',
      ru: '⛔ Выключить напоминание',
      en: '⛔ Disable reminder'
    }
  );

  resetMessagesCache();

  const result = {
    migration: 'configuration_reminder_labels_v1',
    updated: 2,
    keys: ['CONFIGURATION_ENABLE', 'CONFIGURATION_DISABLE']
  };

  addAuditLog(
    'CONFIGURATION_REMINDER_LABELS_MIGRATION',
    JSON.stringify(result)
  );

  Logger.log(JSON.stringify(result));
  return result;
}

function migrateConfigurationHorizonPrompts() {
  createOrUpdateMessageValues(
    'CONFIGURATION_BOOKING_EXCEEDS_CACHE',
    {
      uk: 'Горизонт запису не може перевищувати горизонт кешу календаря. Введіть нове значення не більше',
      ru: 'Горизонт записи не может превышать горизонт кеша календаря. Введите новое значение не больше',
      en: 'Booking horizon cannot exceed the Calendar cache horizon. Enter a new value no greater than'
    }
  );

  createOrUpdateMessageValues(
    'CONFIGURATION_CACHE_BELOW_BOOKING',
    {
      uk: 'Горизонт кешу не може бути меншим за горизонт онлайн-запису. Введіть нове значення не менше',
      ru: 'Горизонт кеша не может быть меньше горизонта онлайн-записи. Введите новое значение не меньше',
      en: 'Calendar cache horizon cannot be shorter than the booking horizon. Enter a new value no less than'
    }
  );

  resetMessagesCache();

  const result = {
    migration: 'configuration_horizon_prompts_v1',
    updated: 2
  };

  addAuditLog(
    'CONFIGURATION_HORIZON_PROMPTS_MIGRATION',
    JSON.stringify(result)
  );

  Logger.log(JSON.stringify(result));
  return result;
}

function migrateConfigurationMessages() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.MESSAGES);

  if (!sheet) {
    throw new Error('Messages sheet not found');
  }

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });
  const expectedHeaders = ['key', 'uk', 'ru', 'en'];

  expectedHeaders.forEach(function(header) {
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

  migrationRows.forEach(function(sourceRow) {
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

    rowsToAppend.push(headers.map(function(header) {
      return valuesByHeader[header] || '';
    }));
  });

  if (rowsToAppend.length > 0) {
    sheet
      .getRange(
        sheet.getLastRow() + 1,
        1,
        rowsToAppend.length,
        headers.length
      )
      .setValues(rowsToAppend);
  }

  resetMessagesCache();

  const result = {
    migration: 'configuration_messages_v1',
    added: rowsToAppend.length,
    skipped: skippedKeys.length,
    addedKeys: rowsToAppend.map(function(row) {
      return row[keyIndex];
    }),
    skippedKeys: skippedKeys
  };

  addAuditLog(
    'CONFIGURATION_MESSAGES_MIGRATION',
    JSON.stringify(result)
  );

  Logger.log(JSON.stringify(result));
  return result;
}

function migrateSystemConfigurationSettings() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.SETTINGS);

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

  addAuditLog(
    'SYSTEM_CONFIGURATION_SETTINGS_MIGRATED',
    JSON.stringify(result)
  );

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
    .map(function(header) {
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

  const values = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 1)
    .getValues();
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
    .map(function(header) {
      return String(header || '').trim();
    });
  const sessionDataIndex = headers.indexOf('session_data');

  if (sessionDataIndex === -1) {
    return 0;
  }

  const range = sheet.getRange(
    2,
    sessionDataIndex + 1,
    sheet.getLastRow() - 1,
    1
  );
  const values = range.getValues();
  let updatedCount = 0;

  values.forEach(function(row) {
    const text = String(row[0] || '').trim();

    if (!text) {
      return;
    }

    try {
      const data = JSON.parse(text);
      let changed = false;

      [
        'service_price_min',
        'service_price_max',
        'customer_service_price'
      ].forEach(function(key) {
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

  deleted.Settings = deleteSheetRowsByFirstColumnValue(
    spreadsheet.getSheetByName(SHEET_NAMES.SETTINGS),
    ['BusinessName', 'Currency']
  );

  deleted.Messages = deleteSheetRowsByFirstColumnValue(
    spreadsheet.getSheetByName(SHEET_NAMES.MESSAGES),
    [
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
    ]
  );

  deleted.Services = deleteSheetColumnsByHeader(
    spreadsheet.getSheetByName(SHEET_NAMES.SERVICES),
    ['price_min', 'price_max']
  );

  deleted.CustomerServiceSettings = deleteSheetColumnsByHeader(
    spreadsheet.getSheetByName(SHEET_NAMES.CUSTOMER_SERVICE_SETTINGS),
    ['price']
  );

  const userSessionsSheet = spreadsheet.getSheetByName(
    SHEET_NAMES.USER_SESSIONS
  );

  deleted.UserSessionValues = removeFinancialValuesFromUserSessions(
    userSessionsSheet
  );

  deleted.UserSessions = deleteSheetColumnsByHeader(
    userSessionsSheet,
    [
      'service_price_min',
      'service_price_max',
      'customer_service_price'
    ]
  );

  resetSettingsCache();
  resetMessagesCache();
  SERVICES_CACHE = null;
  SERVICES_INCLUDING_INACTIVE_CACHE = null;

  addAuditLog(
    'FINANCIAL_FIELDS_REMOVED',
    JSON.stringify(deleted)
  );

  Logger.log(JSON.stringify(deleted));

  return deleted;
}

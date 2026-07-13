const ADMIN_CONFIGURATION_SETTINGS = {
  Language: {
    type: 'enum',
    values: ['uk', 'ru', 'en']
  },
  AdminTelegramIds: {
    type: 'telegram_id_list'
  },
  ReminderDayBefore: {
    type: 'boolean'
  },
  BookingDaysAhead: {
    type: 'integer',
    min: 1,
    max: 365
  },
  CalendarCacheDays: {
    type: 'integer',
    min: 1,
    max: 365
  },
  PaginationPageSize: {
    type: 'integer',
    min: 1,
    max: 10
  },
  DefaultWorkStartTime: {
    type: 'time'
  },
  DefaultWorkEndTime: {
    type: 'time'
  }
};

function getAdminConfigurationDefinition(settingKey) {
  return ADMIN_CONFIGURATION_SETTINGS[settingKey] || null;
}

function isAllowedAdminConfigurationValue(settingKey, value) {
  const definition = getAdminConfigurationDefinition(settingKey);

  if (!definition) {
    return false;
  }

  if (definition.type === 'enum') {
    return definition.values.indexOf(String(value)) !== -1;
  }

  if (definition.type === 'telegram_id_list') {
    return /^\d+(,\d+)*$/.test(String(value));
  }

  if (definition.type === 'boolean') {
    return value === true || value === false;
  }

  if (definition.type === 'integer') {
    return Number.isInteger(value) && value >= definition.min && value <= definition.max;
  }

  if (definition.type === 'time') {
    return isValidTimeValue(value);
  }

  return false;
}

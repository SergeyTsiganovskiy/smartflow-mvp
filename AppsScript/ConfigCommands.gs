function updateSettingValue(settingKey, value) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.SETTINGS);

  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === String(settingKey)) {
      if (String(rows[i][0]) !== String(settingKey)) {
        sheet.getRange(i + 1, 1).setValue(settingKey);
      }

      const valueCell = sheet.getRange(i + 1, 2);

      if (settingKey === 'AdminTelegramIds') {
        valueCell.setNumberFormat('@');
        valueCell.setValue(String(value));
      } else {
        valueCell.setValue(value);
      }

      resetSettingsCache();
      return true;
    }
  }

  const newRow = sheet.getLastRow() + 1;
  sheet.getRange(newRow, 1).setValue(settingKey);

  const valueCell = sheet.getRange(newRow, 2);
  if (settingKey === 'AdminTelegramIds') {
    valueCell.setNumberFormat('@');
    valueCell.setValue(String(value));
  } else {
    valueCell.setValue(value);
  }

  resetSettingsCache();
  return true;
}

function updateAdminConfigurationValue(settingKey, value) {
  if (!isAllowedAdminConfigurationValue(settingKey, value)) {
    return false;
  }

  return updateSettingValue(settingKey, value);
}

function setUserState(telegramId, state) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.USER_STATES);

  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(telegramId)) {
      sheet.getRange(i + 1, 2).setValue(state);
      sheet.getRange(i + 1, 3).setValue(new Date());
      return;
    }
  }

  sheet.appendRow([telegramId, state, new Date()]);
}

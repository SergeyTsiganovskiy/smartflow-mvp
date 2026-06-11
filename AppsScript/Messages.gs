function getMessage(messageKey) {
  const settings = getSettings();
  const lang = settings.Language || 'ru';

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.MESSAGES);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const keyIndex = headers.indexOf('key');
  const langIndex = headers.indexOf(lang);

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][keyIndex] === messageKey) {
      return rows[i][langIndex] || messageKey;
    }
  }

  return messageKey;
}
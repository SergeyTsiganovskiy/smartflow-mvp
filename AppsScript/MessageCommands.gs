function createOrUpdateMessageValues(messageKey, valuesByLang) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.MESSAGES);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const keyIndex = headers.indexOf('key');

  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][keyIndex]) === String(messageKey)) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex === -1) {
    const newRow = headers.map(function(header) {
      if (header === 'key') {
        return messageKey;
      }

      return valuesByLang[header] || '';
    });

    sheet.appendRow(newRow);
    return;
  }

  headers.forEach(function(header, index) {
    if (header === 'key') {
      return;
    }

    if (valuesByLang[header] !== undefined) {
      sheet
        .getRange(rowIndex, index + 1)
        .setValue(valuesByLang[header]);
    }
  });
}

function createMessageValuesForAllLanguages(value) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.MESSAGES);

  const headers =
    sheet.getDataRange().getValues()[0];

  const result = {};

  headers.forEach(function(header) {
    const columnName =
      String(header).trim();

    if (columnName === 'key') {
      return;
    }

    result[columnName] = value;
  });

  return result;
}

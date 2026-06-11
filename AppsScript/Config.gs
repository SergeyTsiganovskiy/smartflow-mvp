const SHEET_NAMES = {
  SETTINGS: 'Settings',
  MESSAGES: 'Messages',
  CUSTOMERS: 'Customers',
  REQUESTS: 'Requests',
  REQUEST_OPTIONS: 'RequestOptions',
  APPOINTMENTS: 'Appointments'
};

function getSettings() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.SETTINGS);

  const rows = sheet.getDataRange().getValues();

  const settings = {};

  for (let i = 1; i < rows.length; i++) {
    const key = rows[i][0];
    const value = rows[i][1];

    if (key) {
      settings[key] = value;
    }
  }

  return settings;
}
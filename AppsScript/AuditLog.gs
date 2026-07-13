function addAuditLog(action, details) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.AUDIT_LOG);

  sheet.appendRow([new Date(), action, details]);
}

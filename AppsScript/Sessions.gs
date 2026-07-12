function getUserSession(telegramId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.USER_SESSIONS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return null;
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const telegramIndex = headers.indexOf('telegram_id');
  const sessionDataIndex = headers.indexOf('session_data');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][telegramIndex]) === String(telegramId)) {
      const session = {};

      // 1. Сначала читаем старые колонки,
      // чтобы существующий код не сломался.
      headers.forEach(function(header, index) {
        session[header] = rows[i][index];
      });

      // 2. Потом накладываем JSON-данные поверх старых колонок.
      if (
        sessionDataIndex !== -1 &&
        rows[i][sessionDataIndex]
      ) {
        try {
          const jsonSession =
            JSON.parse(rows[i][sessionDataIndex]);

          Object.keys(jsonSession).forEach(function(key) {
            session[key] = jsonSession[key];
          });

        } catch (error) {
          addAuditLog(
            'SESSION_JSON_PARSE_ERROR',
            String(error)
          );
        }
      }

      return session;
    }
  }

  return null;
}

// =========================
// CALENDAR CACHE
// =========================

let CALENDAR_CACHE = null;


function getCalendarCache() {
    if (CALENDAR_CACHE) {
        return CALENDAR_CACHE;
    }

    const sheet = SpreadsheetApp
        .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CALENDAR_CACHE);

    const rows =
        sheet.getDataRange().getValues();

    const result = [];

    if (rows.length < 2) {
        CALENDAR_CACHE = result;
        return result;
    }

    const headers =
        rows[0].map(function(header) {
            return String(header).trim();
        });

    for (let i = 1; i < rows.length; i++) {
        const item = {};


        headers.forEach(function(header, index) {
            item[header] = rows[i][index];
        });

        result.push(item);


    }

    CALENDAR_CACHE = result;

    return result;
}

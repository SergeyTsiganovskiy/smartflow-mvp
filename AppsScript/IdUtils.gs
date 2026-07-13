function generateNextEntityId(sheetName, idColumnName, prefix) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return prefix + '_001';
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const idIndex = headers.indexOf(idColumnName);

  if (idIndex === -1) {
    throw new Error('Column not found: ' + idColumnName);
  }

  let maxNumber = 0;

  for (let i = 1; i < rows.length; i++) {
    const value = String(rows[i][idIndex] || '').trim();

    const regex = new RegExp('^' + prefix + '_(\\d+)$');

    const match = value.match(regex);

    if (!match) {
      continue;
    }

    const number = Number(match[1]);

    if (number > maxNumber) {
      maxNumber = number;
    }
  }

  return prefix + '_' + String(maxNumber + 1).padStart(3, '0');
}

function generateLocationId() {
  return generateNextEntityId('Locations', 'location_id', 'loc');
}

function generateProviderId() {
  return generateNextEntityId('Providers', 'provider_id', 'prov');
}

function generateServiceId() {
  return generateNextEntityId('Services', 'service_id', 'serv');
}

function generateCustomerId() {
  return generateNextEntityId('Customers', 'customer_id', 'cust');
}

function generateRequestId() {
  return generateNextEntityId('Requests', 'request_id', 'req');
}

function generateAppointmentId() {
  return generateNextEntityId('Appointments', 'appointment_id', 'appt');
}

function generateId(prefix) {
  return prefix + '_' + new Date().getTime();
}

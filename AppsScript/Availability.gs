function getProviderScheduleOverrideForDate(providerId, normalizedDate) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.PROVIDER_SCHEDULE_OVERRIDES);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const providerIdIndex = headers.indexOf('provider_id');
  const dateIndex = headers.indexOf('date');
  const startIndex = headers.indexOf('start_time');
  const endIndex = headers.indexOf('end_time');
  const workingIndex = headers.indexOf('is_working');

  for (let i = 1; i < rows.length; i++) {
    const rowDate = normalizeDateForStorage(rows[i][dateIndex]);

    if (String(rows[i][providerIdIndex]) === String(providerId) && rowDate === normalizedDate) {
      return {
        isWorking: String(rows[i][workingIndex]).toUpperCase() === 'TRUE',
        startTime: normalizeTimeForStorage(rows[i][startIndex]),
        endTime: normalizeTimeForStorage(rows[i][endIndex])
      };
    }
  }

  return null;
}

function getProviderWeeklySchedule(providerId, dayOfWeek) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.PROVIDER_SCHEDULE);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const providerIdIndex = headers.indexOf('provider_id');
  const dayIndex = headers.indexOf('day_of_week');
  const startIndex = headers.indexOf('start_time');
  const endIndex = headers.indexOf('end_time');
  const workingIndex = headers.indexOf('is_working');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][providerIdIndex]) === String(providerId) &&
      String(rows[i][dayIndex]).toUpperCase() === dayOfWeek
    ) {
      return {
        isWorking: String(rows[i][workingIndex]).toUpperCase() === 'TRUE',
        startTime: normalizeTimeForStorage(rows[i][startIndex]),
        endTime: normalizeTimeForStorage(rows[i][endIndex])
      };
    }
  }

  return {
    isWorking: false,
    startTime: '',
    endTime: ''
  };
}

function getAvailableTimeSlots(providerId, dateValue, durationMinutes, customerId) {
  const schedule = getProviderScheduleForDate(providerId, dateValue);

  if (!schedule || (String(schedule.is_working).toUpperCase() !== 'TRUE' && schedule.is_working !== true)) {
    return [];
  }

  if (!schedule.start_time || !schedule.end_time) {
    return [];
  }

  let startMinutes = timeToMinutes(schedule.start_time);

  const endMinutes = timeToMinutes(schedule.end_time);

  if (isSameDate(dateValue, new Date())) {
    const bufferMinutes = 30;
    const stepMinutes = 30;

    const earliestMinutes = getCurrentTimeMinutes() + bufferMinutes;

    const roundedEarliestMinutes = roundMinutesUpToStep(earliestMinutes, stepMinutes);

    if (roundedEarliestMinutes > startMinutes) {
      startMinutes = roundedEarliestMinutes;
    }
  }

  const providerAppointments = getProviderAppointmentsForDate(providerId, dateValue);

  const customer = customerId ? getCustomerById(customerId) : null;

  const conflictAppointments = customer ? getConflictAppointmentsForDate(customer.phone, dateValue) : [];

  const allBlockingAppointments = providerAppointments.concat(conflictAppointments);

  const busyIntervals = allBlockingAppointments
    .map(function (item) {
      const startTime = item.startTime || extractTimeFromDateTime(item.start_at);

      const endTime = item.endTime || extractTimeFromDateTime(item.end_at);

      if (!startTime || !endTime) {
        return null;
      }

      return {
        start: timeToMinutes(startTime),

        end: timeToMinutes(endTime)
      };
    })
    .filter(function (item) {
      return item !== null;
    });

  const stepMinutes = 30;
  const result = [];

  for (let current = startMinutes; current + Number(durationMinutes) <= endMinutes; current += stepMinutes) {
    const slotStart = current;

    const slotEnd = current + Number(durationMinutes);

    const hasConflict = busyIntervals.some(function (interval) {
      return slotStart < interval.end && slotEnd > interval.start;
    });

    if (!hasConflict) {
      result.push(minutesToTime(current));
    }
  }

  return result;
}

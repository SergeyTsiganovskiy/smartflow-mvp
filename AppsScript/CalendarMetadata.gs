function extractCalendarTechValue(description, key) {
  const text = String(description || '');

  const marker = '[TECH]';
  const markerIndex = text.indexOf(marker);

  if (markerIndex === -1) {
    return '';
  }

  const techText =
    text.substring(markerIndex + marker.length);

  const lines = techText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = String(lines[i]).trim();

    if (line.indexOf(key + '=') === 0) {
      return line
        .substring((key + '=').length)
        .trim();
    }
  }

  return '';
}

function extractAppointmentIdFromText(text) {
  const match =
    String(text || '').match(/appointment_id\s*=\s*([a-zA-Z0-9_\-]+)/i);

  return match ? match[1] : '';
}

function getCalendarLabelValues() {
  const labels = [];

  [
    MESSAGE_KEYS.CALENDAR_LABEL_CUSTOMER,
    MESSAGE_KEYS.CALENDAR_LABEL_PHONE,
    MESSAGE_KEYS.CALENDAR_LABEL_SERVICE,
    MESSAGE_KEYS.CALENDAR_LABEL_PROVIDER,
    MESSAGE_KEYS.CALENDAR_LABEL_LOCATION,
    MESSAGE_KEYS.CALENDAR_LABEL_COMMENT
  ].forEach(function(messageKey) {
    getMessageValues(messageKey)
      .forEach(function(value) {
        if (value) {
          labels.push(value);
        }
      });
  });

  return labels;
}

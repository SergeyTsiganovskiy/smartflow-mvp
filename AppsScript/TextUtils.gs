function extractFieldFromText(text, fieldName) {
  const value = String(text || '');

  const regex = new RegExp(
    fieldName + '\\s*[:\\-]\\s*(.+)',
    'i'
  );

  const match = value.match(regex);

  if (match) {
    return String(match[1]).trim();
  }

  return '';
}

function normalizeTextForSearch(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractValueByLabel(
  text,
  labels
) {
  const source =
    String(text || '');

  if (!source) {
    return '';
  }

  const allLabels =
    getCalendarLabelValues();

  for (let i = 0; i < labels.length; i++) {
    const label =
      String(labels[i] || '').trim();

    if (!label) {
      continue;
    }

    const startMarker =
      label + ':';

    const startIndex =
      source.indexOf(startMarker);

    if (startIndex === -1) {
      continue;
    }

    const valueStart =
      startIndex + startMarker.length;

    let valueEnd =
      source.length;

    allLabels.forEach(function(nextLabel) {
      const nextMarker =
        String(nextLabel || '').trim() + ':';

      if (!nextMarker || nextMarker === startMarker) {
        return;
      }

      const nextIndex =
        source.indexOf(
          nextMarker,
          valueStart
        );

      if (
        nextIndex !== -1 &&
        nextIndex < valueEnd
      ) {
        valueEnd = nextIndex;
      }
    });

    return source
      .substring(
        valueStart,
        valueEnd
      )
      .trim();
  }

  return '';
}

function findItemByName(items, name) {
  const searchName =
    String(name || '').trim();

  for (let i = 0; i < items.length; i++) {
    if (
      String(items[i].name || '').trim() ===
      searchName
    ) {
      return items[i];
    }
  }

  return null;
}

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');

  if (digits.length === 9) {
    return '0' + digits;
  }

  return digits;
}

function isValidPhone(phone) {
  const normalized = normalizePhone(phone);
  return normalized.length >= 7;
}

function getPhoneSearchKey(phone) {
  const normalized = normalizePhone(phone);

  if (normalized.length >= 9) {
    return normalized.slice(-9);
  }

  return normalized;
}

function extractPhoneFromText(text) {
  const value = String(text || '');

  const match = value.match(/(?:Phone|Телефон|Тел|Phone number)\s*[:\-]?\s*([+\d\s().-]{7,20})/i);

  if (match) {
    return normalizePhone(match[1]);
  }

  const fallback = value.match(/(\+?\d[\d\s().-]{6,18}\d)/);

  if (fallback) {
    return normalizePhone(fallback[1]);
  }

  return '';
}

function formatPhoneForDisplay(phone) {
  const value =
    String(phone || '').trim();

  if (!value) {
    return '-';
  }

  if (
    value.length === 9 &&
    value[0] !== '0'
  ) {
    return '0' + value;
  }

  return value;
}

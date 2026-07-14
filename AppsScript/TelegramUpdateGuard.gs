const TELEGRAM_UPDATE_HISTORY_LIMIT = 250;
const TELEGRAM_UPDATE_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

function getTelegramUpdateHistoryKey(botType) {
  return 'TELEGRAM_PROCESSED_UPDATES_' + String(botType || '').toUpperCase();
}

function parseTelegramUpdateHistory(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(function (item) {
      return Array.isArray(item) && item.length >= 2 && Number.isFinite(Number(item[1]));
    });
  } catch (error) {
    return [];
  }
}

function pruneTelegramUpdateHistory(history, now) {
  const oldestAllowed = now - TELEGRAM_UPDATE_RETENTION_MS;

  return history
    .filter(function (item) {
      return Number(item[1]) >= oldestAllowed;
    })
    .slice(-TELEGRAM_UPDATE_HISTORY_LIMIT);
}

function hasProcessedTelegramUpdate(history, updateId) {
  const targetId = String(updateId);

  return history.some(function (item) {
    return String(item[0]) === targetId;
  });
}

function migrateLegacyTelegramUpdateId(properties, botType, history, now) {
  const legacyKey = String(botType || '').toUpperCase() + '_LAST_UPDATE_ID';
  const legacyUpdateId = properties.getProperty(legacyKey);

  if (legacyUpdateId && !hasProcessedTelegramUpdate(history, legacyUpdateId)) {
    history.push([String(legacyUpdateId), now]);
  }

  if (legacyUpdateId) {
    properties.deleteProperty(legacyKey);
  }

  return Boolean(legacyUpdateId);
}

function processTelegramUpdateOnce(updateId, botType, handler) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const properties = PropertiesService.getScriptProperties();
    const key = getTelegramUpdateHistoryKey(botType);
    const now = Date.now();
    const history = pruneTelegramUpdateHistory(parseTelegramUpdateHistory(properties.getProperty(key)), now);
    const migratedLegacyUpdate = migrateLegacyTelegramUpdateId(properties, botType, history, now);

    if (migratedLegacyUpdate) {
      properties.setProperty(key, JSON.stringify(pruneTelegramUpdateHistory(history, now)));
    }

    if (hasProcessedTelegramUpdate(history, updateId)) {
      return { duplicate: true };
    }

    handler();

    history.push([String(updateId), now]);
    properties.setProperty(key, JSON.stringify(pruneTelegramUpdateHistory(history, now)));

    return { duplicate: false };
  } finally {
    lock.releaseLock();
  }
}

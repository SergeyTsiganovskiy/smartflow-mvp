function isDuplicateTelegramUpdate(updateId, prefix) {
  const props = PropertiesService.getScriptProperties();

  const key = prefix + '_LAST_UPDATE_ID';
  const lastUpdateId = Number(props.getProperty(key) || 0);

  if (Number(updateId) <= lastUpdateId) {
    return true;
  }

  props.setProperty(key, String(updateId));

  return false;
}

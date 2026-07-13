function buildKeyboardWithMainMenu(rows, language) {
  const keyboardRows = rows ? rows.slice() : [];
  const backText = getMessage(MESSAGE_KEYS.BACK, language);
  const mainMenuText = getMessage(MESSAGE_KEYS.MAIN_MENU, language);

  const footer = [
    {
      text: backText
    },
    {
      text: mainMenuText
    }
  ];

  const hasFooter = keyboardRows.some(function (row) {
    if (!Array.isArray(row)) {
      return false;
    }

    return row.some(function (button) {
      return button && (button.text === backText || button.text === mainMenuText);
    });
  });

  if (!hasFooter) {
    keyboardRows.push(footer);
  }

  return {
    keyboard: keyboardRows,
    resize_keyboard: true
  };
}

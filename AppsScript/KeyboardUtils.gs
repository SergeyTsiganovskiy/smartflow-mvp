function buildKeyboardWithMainMenu(rows) {
  const keyboardRows =
    rows ? rows.slice() : [];

  const footer = [
    {
      text: getMessage(MESSAGE_KEYS.BACK)
    },
    {
      text: getMessage(MESSAGE_KEYS.MAIN_MENU)
    }
  ];

  const hasFooter =
    keyboardRows.some(function(row) {
      if (!Array.isArray(row)) {
        return false;
      }

      return row.some(function(button) {
        return (
          button &&
          (
            button.text === getMessage(MESSAGE_KEYS.BACK) ||
            button.text === getMessage(MESSAGE_KEYS.MAIN_MENU)
          )
        );
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

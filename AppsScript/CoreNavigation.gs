function resetNavigation(chatId) {
  setUserSessionValue(
    chatId,
    'navigation_stack',
    JSON.stringify([])
  );
}

function getNavigationStack(chatId) {
  const session =
    getUserSession(chatId);

  if (!session.navigation_stack) {
    return [];
  }

  try {
    return JSON.parse(
      session.navigation_stack
    );
  } catch (error) {
    return [];
  }
}

function saveNavigationStack(chatId, stack) {
  setUserSessionValue(
    chatId,
    'navigation_stack',
    JSON.stringify(stack)
  );
}

function pushNavigation(chatId, menu) {
  const session =
    getUserSession(chatId);

  if (session.navigation_render_only === true) {
    return;
  }

  const stack =
    getNavigationStack(chatId);

  stack.push({
    menu: menu
  });

  saveNavigationStack(chatId, stack);
}

function getCurrentNavigation(chatId) {
  const stack =
    getNavigationStack(chatId);

  return stack.length > 0
    ? stack[stack.length - 1]
    : null;
}

function setNavigationRenderOnly(chatId, value) {
  setUserSessionValue(
    chatId,
    'navigation_render_only',
    value
  );
}

function trimNavigationToMenu(chatId, menu) {
  const stack =
    getNavigationStack(chatId);

  let targetIndex = -1;

  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].menu === menu) {
      targetIndex = i;
      break;
    }
  }

  if (targetIndex === -1) {
    return false;
  }

  const newStack =
    stack.slice(0, targetIndex + 1);

  saveNavigationStack(
    chatId,
    newStack
  );

  return true;
}


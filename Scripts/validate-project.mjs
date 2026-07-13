import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const sourceDir = path.join(root, 'AppsScript');
const files = fs.readdirSync(sourceDir)
  .filter((name) => name.endsWith('.gs'))
  .sort();

const errors = [];
const functions = new Map();
const usedMessageKeys = new Set();
const usedSheetNames = new Set();
const usedClientStates = new Set();
const usedAdminStates = new Set();
const usedClientMenus = new Set();
const usedAdminMenus = new Set();
let messageKeysSource = '';
let sheetNamesSource = '';
let statesSource = '';
let menusSource = '';

for (const file of files) {
  const fullPath = path.join(sourceDir, file);
  const source = fs.readFileSync(fullPath, 'utf8');

  try {
    new vm.Script(source, { filename: file });
  } catch (error) {
    errors.push(`Syntax error in ${file}: ${error.message}`);
  }

  for (const match of source.matchAll(/^function\s+([A-Za-z0-9_]+)\s*\(/gm)) {
    const name = match[1];
    const locations = functions.get(name) || [];
    locations.push(file);
    functions.set(name, locations);
  }

  for (const match of source.matchAll(/MESSAGE_KEYS\.([A-Z][A-Z0-9_]*)/g)) {
    usedMessageKeys.add(match[1]);
  }

  for (const match of source.matchAll(/SHEET_NAMES\.([A-Z][A-Z0-9_]*)/g)) {
    usedSheetNames.add(match[1]);
  }

  for (const match of source.matchAll(/\bSTATES\.([A-Z][A-Z0-9_]*)/g)) {
    usedClientStates.add(match[1]);
  }

  for (const match of source.matchAll(/\bADMIN_STATES\.([A-Z][A-Z0-9_]*)/g)) {
    usedAdminStates.add(match[1]);
  }

  for (const match of source.matchAll(/\bCLIENT_MENUS\.([A-Z][A-Z0-9_]*)/g)) {
    usedClientMenus.add(match[1]);
  }

  for (const match of source.matchAll(/\bADMIN_MENUS\.([A-Z][A-Z0-9_]*)/g)) {
    usedAdminMenus.add(match[1]);
  }

  if (
    file !== 'States.gs' &&
    /(?:state\s*===|setUserState\([\s\S]{0,120}?)\s*['"](?:ADMIN_)?WAITING_[A-Z0-9_]+['"]/.test(source)
  ) {
    errors.push(`Hardcoded conversation state in ${file}`);
  }

  if (/getSheetByName\(\s*['"]/.test(source)) {
    errors.push(`Hardcoded sheet name in ${file}`);
  }

  if (
    file !== 'ConfigurationMigrations.gs' &&
    /\bOwnerTelegramId\b|\bnotifyOwner|\bbuildOwner/.test(source)
  ) {
    errors.push(`Legacy Owner runtime reference in ${file}`);
  }

  if (
    file !== 'ConfigurationMigrations.gs' &&
    /\b(?:price_min|price_max|customer_service_price|service_price_min|service_price_max|BusinessName|Currency)\b/.test(source)
  ) {
    errors.push(`Financial runtime reference in ${file}`);
  }

  if (/^const\s+MESSAGE_KEYS\s*=/m.test(source)) {
    messageKeysSource = source;
  }

  if (/^const\s+SHEET_NAMES\s*=/m.test(source)) {
    sheetNamesSource = source;
  }

  if (
    /^const\s+STATES\s*=/m.test(source) &&
    /^const\s+ADMIN_STATES\s*=/m.test(source)
  ) {
    statesSource = source;
  }

  if (
    /^const\s+CLIENT_MENUS\s*=/m.test(source) &&
    /^const\s+ADMIN_MENUS\s*=/m.test(source)
  ) {
    menusSource = source;
  }
}

for (const [name, locations] of functions) {
  if (locations.length > 1) {
    errors.push(`Duplicate global function ${name}: ${locations.join(', ')}`);
  }
}

function getObjectKeys(source, objectName) {
  const match = source.match(
    new RegExp(`const\\s+${objectName}\\s*=\\s*\\{([\\s\\S]*?)\\n\\};`)
  );

  if (!match) {
    errors.push(`Missing ${objectName} declaration`);
    return [];
  }

  return [...match[1].matchAll(/^\s+([A-Z][A-Z0-9_]+):/gm)]
    .map((item) => item[1]);
}

function validateConstantObject(source, objectName, usedKeys) {
  const keys = getObjectKeys(source, objectName);
  const definedKeys = new Set();

  keys.forEach(function(key) {
    if (definedKeys.has(key)) {
      errors.push(`Duplicate ${objectName}.${key}`);
    }
    definedKeys.add(key);
  });

  for (const key of [...usedKeys].sort()) {
    if (!definedKeys.has(key)) {
      errors.push(`Undefined ${objectName}.${key}`);
    }
  }

  return definedKeys.size;
}

const messageKeyCount =
  validateConstantObject(messageKeysSource, 'MESSAGE_KEYS', usedMessageKeys);

const sheetNameCount =
  validateConstantObject(sheetNamesSource, 'SHEET_NAMES', usedSheetNames);

const clientStateCount =
  validateConstantObject(statesSource, 'STATES', usedClientStates);

const adminStateCount =
  validateConstantObject(statesSource, 'ADMIN_STATES', usedAdminStates);

const clientMenuCount =
  validateConstantObject(menusSource, 'CLIENT_MENUS', usedClientMenus);

const adminMenuCount =
  validateConstantObject(menusSource, 'ADMIN_MENUS', usedAdminMenus);

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(
  `Validation passed: ${files.length} files, ` +
  `${functions.size} global functions, ${messageKeyCount} message keys, ` +
  `${sheetNameCount} sheet names, ${clientStateCount} client states, ` +
  `${adminStateCount} admin states, ${clientMenuCount} client menus, ` +
  `${adminMenuCount} admin menus.`
);

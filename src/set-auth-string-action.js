const localStorageKeys = require('./local-storage-keys');

function setAuthStringAction(command, args, schemeKey) {
  command.log();

  // try to get auth object from local storage (initialize if missing or invalid)
  const authJson = command.parent.localStorage.getItem(localStorageKeys.AUTH);
  let auth = null;
  try {
    auth = authJson ? JSON.parse(authJson) : {};
  } catch (err) {
    auth = {};
  }

  auth[schemeKey] = args.value;

  command.parent.localStorage.setItem(
    localStorageKeys.AUTH,
    JSON.stringify(auth)
  );
  command.log('Authentication set');

  command.log();

  return Promise.resolve();
}

module.exports = setAuthStringAction;

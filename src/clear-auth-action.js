const _ = require('lodash');

const localStorageKeys = require('./local-storage-keys');

function clearAuthAction(command, args, schemeKey) {
  command.log();

  // try to get auth object from local storage (initialize if missing or invalid)
  const authJson = command.parent.localStorage.getItem(localStorageKeys.AUTH);
  if (authJson) {
    let auth = null;
    try {
      auth = authJson ? JSON.parse(authJson) : {};
    } catch (err) {
      auth = {};
    }

    auth = _.omit(auth, schemeKey);

    command.parent.localStorage.setItem(
      localStorageKeys.AUTH,
      JSON.stringify(auth)
    );
  }
  command.log('Authentication cleared.');

  command.log();

  return Promise.resolve();
}

module.exports = clearAuthAction;

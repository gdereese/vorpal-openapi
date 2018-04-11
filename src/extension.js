const aboutCommandBuilder = require('./about-command-builder');
const baseBuilder = require('./base-builder');
const clearAuthCommandBuilder = require('./clear-auth-command-builder');
const operationCommandsBuilder = require('./operation-commands-builder');
const setAuthApiKeyCommandBuilder = require('./set-auth-api-key-command-builder');
const setAuthBasicCommandBuilder = require('./set-auth-basic-command-builder');
const splashWriter = require('./splash-writer');

function extension(vorpal, options) {
  vorpal
    .use(baseBuilder, options)
    .use(aboutCommandBuilder, options)
    .use(setAuthApiKeyCommandBuilder, options)
    .use(setAuthBasicCommandBuilder, options)
    .use(clearAuthCommandBuilder, options)
    .use(operationCommandsBuilder, options)
    .use(splashWriter, options);
}

module.exports = extension;

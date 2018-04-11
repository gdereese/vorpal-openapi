const aboutCommandBuilder = require('./about-command-builder');
const baseBuilder = require('./base-builder');
const clearAuthCommandBuilder = require('./clear-auth-command-builder');
const operationCommandsBuilder = require('./operation-commands-builder');
const setAuthStringCommandBuilder = require('./set-auth-string-command-builder');
const splashWriter = require('./splash-writer');

function extension(vorpal, options) {
  vorpal
    .use(baseBuilder, options)
    .use(aboutCommandBuilder, options)
    .use(
      (vorpal, options) =>
        setAuthStringCommandBuilder(vorpal, options, 'apiKey'),
      options
    )
    .use(
      (vorpal, options) =>
        setAuthStringCommandBuilder(vorpal, options, 'basic'),
      options
    )
    .use(clearAuthCommandBuilder, options)
    .use(operationCommandsBuilder, options)
    .use(splashWriter, options);
}

module.exports = extension;

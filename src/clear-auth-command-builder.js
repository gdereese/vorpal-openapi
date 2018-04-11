const _ = require('lodash');

const clearAuthAction = require('./clear-auth-action');

function clearAuthCommandBuilder(vorpal, options) {
  const commands = [];

  const action = (args, schemeKey) =>
    clearAuthAction(vorpal.activeCommand, args, schemeKey);

  for (const schemeKey of _.keys(options.spec.securityDefinitions)) {
    const command = vorpal
      .command(
        `clear-auth ${_.kebabCase(schemeKey)}`,
        `Clear authorization value for security scheme '${schemeKey}'`
      )
      .action(args => action(args, schemeKey));
    commands.push(command);
  }

  return commands;
}

module.exports = clearAuthCommandBuilder;

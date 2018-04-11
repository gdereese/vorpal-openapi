const _ = require('lodash');

const clearAuthAction = require('./clear-auth-action');

function clearAuthCommandBuilder(vorpal, options) {
  const commands = [];

  for (const schemeKey of _.keys(options.spec.securityDefinitions)) {
    const command = vorpal
      .command(
        `clear-auth ${_.kebabCase(schemeKey)}`,
        `Clear authorization value for security scheme '${schemeKey}'`
      )
      .action(args => clearAuthAction(vorpal.activeCommand, args, schemeKey));
    commands.push(command);
  }

  return commands;
}

module.exports = clearAuthCommandBuilder;

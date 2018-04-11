const _ = require('lodash');
const StringBuilder = require('string-builder');

function operationCommandHelp(command, commandInfo) {
  const helpBuilder = new StringBuilder();

  // add the operation summary to the command description so it can be
  // displayed using the default help logic, then reset to the original
  // value afterwards
  const oldDescription = command._description;
  if (
    commandInfo.operation.description &&
    commandInfo.operation.description.length > 0
  ) {
    command._description += `\n\n  ${commandInfo.operation.description}`;
  }
  helpBuilder.append(command.helpInformation());
  command._description = oldDescription;

  // list security requirements (and any required scopes)
  if (
    commandInfo.operation.security &&
    commandInfo.operation.security.length > 0
  ) {
    const securityListBuilder = new StringBuilder();

    for (const requirement of commandInfo.operation.security) {
      securityListBuilder.append('    - ');

      const andSchemeNames = _.keys(requirement);
      for (let nameIndex = 0; nameIndex < andSchemeNames.length; nameIndex++) {
        const name = andSchemeNames[nameIndex];

        if (nameIndex > 0) {
          securityListBuilder.append('\n      ');
        }

        securityListBuilder.append(name);

        const scopes = requirement[name];
        if (scopes && scopes.length > 0) {
          securityListBuilder.append(` (${scopes.join(', ')})`);
        }
      }
    }

    helpBuilder.append(
      `\n  Required Security:\n\n${securityListBuilder.toString()}`
    );
    helpBuilder.appendLine();
  }

  return helpBuilder.toString();
}

module.exports = operationCommandHelp;

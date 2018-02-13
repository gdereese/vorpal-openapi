import * as _ from 'lodash';
import Swagger = require('swagger-client');

import * as commandOptionNames from './command-option-names';
import { OperationCommandAction } from './operation-command-action';
import { OperationCommandInfo } from './operation-command-info';
import { OperationCommandValidator } from './operation-command-validator';
import { Options } from './options';
import { TextBuilder } from './text-builder';

export class OperationCommandBuilder {
  public build(vorpal, options: Options, commandInfo: OperationCommandInfo) {
    const commandString = buildCommandString(options, commandInfo);

    const commandDescriptionBuilder = new TextBuilder();
    commandDescriptionBuilder.addParagraph(commandInfo.operation.summary);
    if (
      commandInfo.operation.description &&
      commandInfo.operation.description.length > 0
    ) {
      commandDescriptionBuilder.addParagraph(
        commandInfo.operation.description,
        '\n\n  '
      );
    }
    const commandDescription = commandDescriptionBuilder.toString();

    const command = vorpal.command(commandString, commandDescription);

    // add option for request content type (based on values in consumes array)
    if (
      commandInfo.operation.consumes &&
      commandInfo.operation.consumes.length > 0
    ) {
      command.option(
        '--' + commandOptionNames.REQUEST_CONTENT_TYPE + ' <mime-type>',
        'desired MIME type of request body',
        commandInfo.operation.consumes
      );
    }

    // add option for response content type (based on values in produces array)
    if (
      commandInfo.operation.produces &&
      commandInfo.operation.produces.length > 0
    ) {
      command.option(
        '--' + commandOptionNames.RESPONSE_CONTENT_TYPE + ' <mime-type>',
        'desired MIME type of response body',
        commandInfo.operation.produces
      );
    }

    // add option for each optional parameter,
    // for enum parameters, add an autocomplete for each possible value
    const optionalParameters = _.filter(commandInfo.operation.parameters, {
      required: false
    });
    for (const parameter of optionalParameters) {
      const optionString = '--' + parameter.name;
      const optionDescription = parameter.description;
      const optionAutocomplete = parameter.items
        ? parameter.items.enum || null
        : null;
      command.option(optionString, optionDescription, optionAutocomplete);
    }

    const validator = new OperationCommandValidator(commandInfo, vorpal);
    command.validate(args => validator.validate(args));

    const swaggerClientPromise = Swagger({ spec: options.spec });
    command.action(args => {
      const action = new OperationCommandAction(
        swaggerClientPromise,
        commandInfo,
        vorpal.activeCommand
      );
      return action.run(args, options);
    });

    return command;
  }
}

function buildCommandString(
  options: Options,
  commandInfo: OperationCommandInfo
): string {
  let commandString = '';

  commandString += commandInfo.commandStringParts.join(' ');

  // append required parameters to command string
  const requiredParameters = _.filter(commandInfo.operation.parameters, {
    required: true
  });
  for (const parameter of requiredParameters) {
    commandString += ' <' + parameter.name + '>';
  }

  return commandString;
}

import * as _ from 'lodash';
import Swagger = require('swagger-client');

import { CommandInfo } from './command-info';
import * as commandOptionNames from './command-option-names';
import { OperationCommandAction } from './operation-command-action';
import { OperationCommandValidator } from './operation-command-validator';
import { Options } from './options';

function actionArgsToRequestParams(args, info: CommandInfo, options: Options) {
  // TODO: parse vorpal command args and convert to request params
  return {};
}

export function build(info: CommandInfo, vorpal, options: Options): any[] {
  const commandString = buildCommandString(info, options);
  const commandDescription = info.operation.summary;
  const command = vorpal.command(commandString, commandDescription);

  // add option for response content type (based on values in produces array)
  if (info.operation.produces && info.operation.produces.length > 0) {
    command.option('--' + commandOptionNames.RESPONSE_CONTENT_TYPE +
      ' <mime-type>', 'desired MIME type of response body', info.operation.produces);
  }

  // add option for each optional parameter,
  // for enum parameters, add an autocomplete for each possible value
  const optionalParameters = _.filter(info.operation.parameters, { required: false });
  for (const parameter of optionalParameters) {
    const optionString = '--' + parameter.name;
    const optionDescription = parameter.description;
    const optionAutocomplete = parameter.items ? (parameter.items.enum || null) : null;
    command.option(optionString, optionDescription, optionAutocomplete);
  }

  const validator = new OperationCommandValidator(info, vorpal);
  command.validate((args) => validator.validate(args));

  const swaggerClientPromise = Swagger({ spec: options.spec });
  const action = new OperationCommandAction(swaggerClientPromise, info, vorpal);
  command.action((args) => action.run(args));

  return command;
}

function buildCommandString(info: CommandInfo, options: Options): string {
  let commandString = '';

  commandString += info.commandStringParts.join(' ');

  // append required parameters to command string
  const requiredParameters = _.filter(info.operation.parameters, { required: true });
  for (const parameter of requiredParameters) {
    commandString += ' <' + parameter.name + '>';
  }

  return commandString;
}

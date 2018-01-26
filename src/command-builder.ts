import * as _ from 'lodash';
import Swagger = require('swagger-client');

import { CommandInfo } from './command-info';
import { Options } from './options';

function actionArgsToRequestParams(args, info: CommandInfo, options: Options) {
  // TODO: parse vorpal command args and convert to request params
  return {};
}

export function build(info: CommandInfo, vorpal, options: Options): any[] {
  const commandString = buildCommandString(info, options);
  const commandDescription = info.operation.summary;
  const command = vorpal.command(commandString, commandDescription);

  // add option for each optional parameter,
  // for enum parameters, add an autocomplete for each possible value
  const optionalParameters = _.filter(info.operation.parameters, { required: false });
  for (const parameter of optionalParameters) {
    const optionString = '--' + parameter.name;
    const optionDescription = parameter.description;
    const optionAutocomplete = parameter.items ? (parameter.items.enum || null) : null;
    command.option(optionString, optionDescription, optionAutocomplete);
  }

  const swaggerClientPromise = Swagger({ spec: options.spec });
  command.action((args) => {
    swaggerClientPromise
      .then((client) => {
        const executeOptions = {
          operationId: info.operation.operationId,
          parameters: args,
        };

        return client.execute(executeOptions)
          .then((response) => handleSuccessResponse(response, vorpal))
          .catch((error) => handleErrorResponse(error, vorpal));
      });
  });

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

function handleErrorResponse(error, vorpal) {
  vorpal.log();
  vorpal.log(vorpal.chalk.red(error.response.status + ' ' + error.response.statusText));
  vorpal.log(error.response.data);
  vorpal.log();
}

function handleSuccessResponse(response, vorpal) {
  vorpal.log();
  vorpal.log(vorpal.chalk.green(response.status + ' ' + response.statusText));
  vorpal.log(response.data);
  vorpal.log();
}

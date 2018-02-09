import * as _ from 'lodash';

import * as commandOptionNames from './command-option-names';
import * as localStorageKeys from './local-storage-keys';
import { OperationCommandInfo } from './operation-command-info';

export class SwaggerExecuteOptionsFactory {
  public create(command, commandInfo: OperationCommandInfo, commandArgs) {
    const executeOptions = {
      operationId: commandInfo.operation.operationId,
      parameters: this.getParameters(commandArgs),
      requestContentType: null,
      responseContentType: null,
      securities: null
    };

    // set securities from any previously-set auth
    const authJson = command.parent.localStorage.getItem(localStorageKeys.AUTH);
    let auth;
    try {
      auth = JSON.parse(authJson) || {};
    } catch {
      auth = {};
    }
    executeOptions.securities = auth;

    // if request-content-type is specified, set execute option
    executeOptions.requestContentType =
      commandArgs.options[commandOptionNames.REQUEST_CONTENT_TYPE];

    // if response-content-type is specified, set execute option
    executeOptions.responseContentType =
      commandArgs.options[commandOptionNames.RESPONSE_CONTENT_TYPE];

    return executeOptions;
  }

  private getParameters(args) {
    const parameters = {};

    const requiredPropNames = _.filter(_.keys(args), key => key !== 'options');
    for (const name of requiredPropNames) {
      parameters[name] = args[name];
    }

    if (args.options) {
      const optionalPropNames = _.keys(args.options);
      for (const name of optionalPropNames) {
        const paramName = _.camelCase(name);
        parameters[paramName] = args.options[name];
      }
    }

    return parameters;
  }
}

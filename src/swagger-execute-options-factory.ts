import * as commandOptionNames from './command-option-names';
import * as localStorageKeys from './local-storage-keys';
import { OperationCommandInfo } from './operation-command-info';

export class SwaggerExecuteOptionsFactory {
  public create(command, commandInfo: OperationCommandInfo, commandArgs) {
    const executeOptions = {
      operationId: commandInfo.operation.operationId,
      parameters: commandArgs
    };

    // set securities from any previously-set auth
    const authJson = command.parent.localStorage.getItem(localStorageKeys.AUTH);
    let auth;
    try {
      auth = JSON.parse(authJson) || {};
    } catch {
      auth = {};
    }
    const securitiesPropName = 'securities';
    executeOptions[securitiesPropName] = auth;

    // if request-content-type is specified, set execute option
    const requestContentType =
      commandArgs.options[commandOptionNames.REQUEST_CONTENT_TYPE];
    if (requestContentType) {
      const requestContentTypePropName = 'requestContentType';
      executeOptions[requestContentTypePropName] = requestContentType;
    }

    // if response-content-type is specified, set execute option
    const responseContentType =
      commandArgs.options[commandOptionNames.RESPONSE_CONTENT_TYPE];
    if (responseContentType) {
      const responseContentTypePropName = 'responseContentType';
      executeOptions[responseContentTypePropName] = responseContentType;
    }

    return executeOptions;
  }
}

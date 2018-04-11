const fs = require('fs');
const _ = require('lodash');

const commandOptionNames = require('./command-option-names');
const localStorageKeys = require('./local-storage-keys');

function apiExecuteOptionsFactory(spec, command, commandInfo, commandArgs) {
  const executeOptions = {
    operationId: commandInfo.operation.operationId,
    parameters: getParameters(commandInfo.operation, commandArgs),
    requestContentType: null,
    responseContentType: null,
    securities: null,
    spec
  };

  // set securities from any previously-set auth
  const authJson = command.parent.localStorage.getItem(localStorageKeys.AUTH);
  let auth;
  try {
    auth = JSON.parse(authJson) || {};
  } catch (err) {
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

function getParameters(operationSpec, args) {
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

  // body parameter can be read in from a file if a value is specified containing a special string token
  const bodyParam = _.find(operationSpec.parameters, { in: 'body' });
  if (bodyParam) {
    const bodyParamValue = args[bodyParam.name];

    if (bodyParamValue.startsWith('file@')) {
      // remove token from start of value to use what follows as the file path
      // (path part also seems to be encased in single-quotes by the time vorpal hands it down here, those also need to go)
      const filePath = bodyParamValue.substr('file@'.length).replace(/'/g, '');
      parameters[bodyParam.name] = fs.readFileSync(filePath).toString();
    }
  }

  return parameters;
}

module.exports = apiExecuteOptionsFactory;

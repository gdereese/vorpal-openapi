const fs = require('fs');
const ora = require('ora');
const StringBuilder = require('string-builder');
const Swagger = require('swagger-client');

const apiExecuteOptionsFactory = require('./api-execute-options-factory');

function operationCommandAction(commandInfo, command, args, options) {
  command.log();

  const executeOptions = apiExecuteOptionsFactory(
    options.spec,
    command,
    commandInfo,
    args
  );

  const spinner = ora('Sending request...');
  spinner.start();

  const request = Swagger.buildRequest(executeOptions);

  return Swagger.http(request)
    .then(response => {
      return handleResponse(
        commandInfo,
        command,
        response,
        spinner,
        command.parent.chalk.green,
        args.options['to-file']
      );
    })
    .catch(error => {
      return handleResponse(
        commandInfo,
        command,
        error.response,
        spinner,
        command.parent.chalk.red,
        args.options['to-file']
      );
    });
}

function handleResponse(
  commandInfo,
  command,
  response,
  spinner,
  chalkColor,
  bodyPath
) {
  return new Promise((resolve, reject) => {
    const resultBuilder = new StringBuilder();
    resultBuilder.append(`${response.status} ${response.statusText}`);
    // if response is expected per the operation spec, display the response description
    const responseSpec = commandInfo.operation.responses[response.status];
    if (responseSpec && responseSpec.description) {
      resultBuilder.append(`: ${responseSpec.description}`);
    }

    const result = resultBuilder.toString();
    if (response.status >= 200 && response.status <= 299) {
      spinner.succeed(chalkColor(result));
    } else {
      spinner.fail(chalkColor(result));
    }

    let responseString = null;
    if (typeof response.data === 'string') {
      responseString = response.data;
    } else if (response.data instanceof Buffer) {
      responseString = response.data.toString();
    }
    if (responseString && responseString.length > 0) {
      command.log(responseString);
    }

    command.log();

    // if body need to be written to file, resolve promise using writeFile callback;
    // otherwise, resolve it now
    if (bodyPath) {
      fs.writeFile(bodyPath, responseString, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

module.exports = operationCommandAction;

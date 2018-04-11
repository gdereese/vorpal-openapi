const _ = require('lodash');

const commandOptionNames = require('./command-option-names');

function operationCommandValidator(commandInfo, vorpal, args) {
  // display warning if specified request content type isn't included in operation.consumes
  if (
    args.options[commandOptionNames.REQUEST_CONTENT_TYPE] &&
    !_.includes(
      commandInfo.operation.consumes,
      args.options[commandOptionNames.REQUEST_CONTENT_TYPE]
    )
  ) {
    vorpal.log(
      vorpal.chalk.yellow(
        `Warning: MIME type ${
          args.options[commandOptionNames.REQUEST_CONTENT_TYPE]
        } is not listed as a possible request content type.  It may not be accepted or honored by the server.`
      )
    );
  }

  // display warning if specified response content type isn't included in operation.produces
  if (
    args.options[commandOptionNames.RESPONSE_CONTENT_TYPE] &&
    !_.includes(
      commandInfo.operation.produces,
      args.options[commandOptionNames.RESPONSE_CONTENT_TYPE]
    )
  ) {
    vorpal.log(
      vorpal.chalk.yellow(
        `Warning: MIME type ${
          args.options[commandOptionNames.RESPONSE_CONTENT_TYPE]
        } is not listed as a possible response content type.  It may not be accepted or honored by the server.`
      )
    );
  }

  return true;
}

module.exports = operationCommandValidator;

const operationCommandValidator = require('../src/operation-command-validator');

describe('operation-command-validator', () => {
  it('logs warning if specified request content type is not included in spec', () => {
    const commandInfo = {
      commandStringParts: null,
      operation: {
        consumes: []
      },
      pathKey: null
    };
    const vorpal = {
      chalk: {
        yellow: () => null
      },
      log: () => null
    };

    spyOn(vorpal, 'log');
    spyOn(vorpal.chalk, 'yellow');

    const args = {
      options: {
        'request-content-type': 'application/foo'
      }
    };

    operationCommandValidator(commandInfo, vorpal, args);

    expect(vorpal.log).toHaveBeenCalledTimes(1);
    expect(vorpal.chalk.yellow).toHaveBeenCalledTimes(1);
  });

  it('logs warning if specified response content type is not included in spec', () => {
    const commandInfo = {
      commandStringParts: null,
      operation: {
        produces: []
      },
      pathKey: null
    };
    const vorpal = {
      chalk: {
        yellow: () => null
      },
      log: () => null
    };

    spyOn(vorpal, 'log');
    spyOn(vorpal.chalk, 'yellow');

    const args = {
      options: {
        'response-content-type': 'application/foo'
      }
    };

    operationCommandValidator(commandInfo, vorpal, args);

    expect(vorpal.log).toHaveBeenCalledTimes(1);
    expect(vorpal.chalk.yellow).toHaveBeenCalledTimes(1);
  });
});

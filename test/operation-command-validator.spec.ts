import { OperationCommandInfo } from '../src/operation-command-info';
import { OperationCommandValidator } from '../src/operation-command-validator';

describe('operation-command-validator', () => {
  it('logs warning if specified request content type is not included in spec', () => {
    const commandInfo: OperationCommandInfo = {
      commandStringParts: null,
      operation: {
        consumes: []
      },
      pathKey: null
    };
    const vorpal = {
      chalk: {
        yellow: text => null
      },
      log: text => null
    };

    spyOn(vorpal, 'log');
    spyOn(vorpal.chalk, 'yellow');

    const validator = new OperationCommandValidator(commandInfo, vorpal);

    const args = {
      options: {
        'request-content-type': 'application/foo'
      }
    };

    validator.validate(args);

    expect(vorpal.log).toHaveBeenCalledTimes(1);
    expect(vorpal.chalk.yellow).toHaveBeenCalledTimes(1);
  });

  it('logs warning if specified response content type is not included in spec', () => {
    const commandInfo: OperationCommandInfo = {
      commandStringParts: null,
      operation: {
        produces: []
      },
      pathKey: null
    };
    const vorpal = {
      chalk: {
        yellow: text => null
      },
      log: text => null
    };

    spyOn(vorpal, 'log');
    spyOn(vorpal.chalk, 'yellow');

    const validator = new OperationCommandValidator(commandInfo, vorpal);

    const args = {
      options: {
        'response-content-type': 'application/foo'
      }
    };

    validator.validate(args);

    expect(vorpal.log).toHaveBeenCalledTimes(1);
    expect(vorpal.chalk.yellow).toHaveBeenCalledTimes(1);
  });
});

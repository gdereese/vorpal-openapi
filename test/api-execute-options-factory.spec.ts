import { ApiExecuteOptionsFactory } from '../src/api-execute-options-factory';
import { OperationCommandInfo } from '../src/operation-command-info';

describe('api-execute-options-factory', () => {
  it('sets operationId from command info', () => {
    const command = {
      parent: {
        localStorage: {
          getItem: key => null
        }
      }
    };
    const commandInfo: OperationCommandInfo = {
      commandStringParts: null,
      operation: {
        operationId: 'test'
      },
      pathKey: null
    };
    const commandArgs = {
      options: {}
    };

    const factory = new ApiExecuteOptionsFactory();

    const options = factory.create(command, commandInfo, commandArgs);

    expect(options.operationId).toBe(commandInfo.operation.operationId);
  });

  it('sets parameters from optional command args', () => {
    const command = {
      parent: {
        localStorage: {
          getItem: key => null
        }
      }
    };
    const commandInfo: OperationCommandInfo = {
      commandStringParts: null,
      operation: {
        operationId: null
      },
      pathKey: null
    };
    const commandArgs = {
      options: {
        foo: 'bar'
      }
    };

    const factory = new ApiExecuteOptionsFactory();

    const options = factory.create(command, commandInfo, commandArgs);

    const foo = 'foo';
    expect(options.parameters[foo]).toBe(commandArgs.options.foo);
  });

  it('sets parameters from required command args', () => {
    const command = {
      parent: {
        localStorage: {
          getItem: key => null
        }
      }
    };
    const commandInfo: OperationCommandInfo = {
      commandStringParts: null,
      operation: {
        operationId: null
      },
      pathKey: null
    };
    const commandArgs = {
      foo: 'bar',
      options: {
        'request-content-type': 'application/bar'
      }
    };

    const factory = new ApiExecuteOptionsFactory();

    const options = factory.create(command, commandInfo, commandArgs);

    const foo = 'foo';
    expect(options.parameters[foo]).toBe(commandArgs.foo);
  });

  it('sets request content type if specified', () => {
    const command = {
      parent: {
        localStorage: {
          getItem: key => null
        }
      }
    };
    const commandInfo: OperationCommandInfo = {
      commandStringParts: null,
      operation: {
        operationId: null
      },
      pathKey: null
    };
    const commandArgs = {
      options: {
        'request-content-type': 'application/bar'
      }
    };

    const factory = new ApiExecuteOptionsFactory();

    const options = factory.create(command, commandInfo, commandArgs);

    expect(options.requestContentType).toBe(
      commandArgs.options['request-content-type']
    );
  });

  it('sets response content type if specified', () => {
    const command = {
      parent: {
        localStorage: {
          getItem: key => null
        }
      }
    };
    const commandInfo: OperationCommandInfo = {
      commandStringParts: null,
      operation: {
        operationId: null
      },
      pathKey: null
    };
    const commandArgs = {
      options: {
        'response-content-type': 'application/bar'
      }
    };

    const factory = new ApiExecuteOptionsFactory();

    const options = factory.create(command, commandInfo, commandArgs);

    expect(options.responseContentType).toBe(
      commandArgs.options['response-content-type']
    );
  });

  it('sets securities from stored auth', () => {
    const command = {
      parent: {
        localStorage: {
          getItem: key => '{"foo":"bar"}'
        }
      }
    };
    const commandInfo: OperationCommandInfo = {
      commandStringParts: null,
      operation: {
        operationId: null
      },
      pathKey: null
    };
    const commandArgs = {
      options: {}
    };

    const factory = new ApiExecuteOptionsFactory();

    const options = factory.create(command, commandInfo, commandArgs);

    expect(options.securities.foo).toBe('bar');
  });
});

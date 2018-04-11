const fs = require('fs');

const apiExecuteOptionsFactory = require('../src/api-execute-options-factory');

describe('api-execute-options-factory', () => {
  it('reads body parameter contents from file if value begins with token', () => {
    const bodyFilePath = './test/fixtures/petstore_swagger.json';
    const spec = {};
    const command = {
      parent: {
        localStorage: {
          getItem: () => null
        }
      }
    };
    const commandInfo = {
      commandStringParts: null,
      operation: {
        operationId: 'test',
        parameters: [
          {
            in: 'body',
            name: 'foo'
          }
        ]
      },
      pathKey: null
    };
    const commandArgs = {
      foo: `file@${bodyFilePath}`,
      options: {}
    };

    const options = apiExecuteOptionsFactory(
      spec,
      command,
      commandInfo,
      commandArgs
    );

    const foo = 'foo';
    expect(options.parameters[foo]).toBe(
      fs.readFileSync(bodyFilePath).toString()
    );
  });

  it('sets operationId from command info', () => {
    const spec = {};
    const command = {
      parent: {
        localStorage: {
          getItem: () => null
        }
      }
    };
    const commandInfo = {
      commandStringParts: null,
      operation: {
        operationId: 'test'
      },
      pathKey: null
    };
    const commandArgs = {
      options: {}
    };

    const options = apiExecuteOptionsFactory(
      spec,
      command,
      commandInfo,
      commandArgs
    );

    expect(options.operationId).toBe(commandInfo.operation.operationId);
  });

  it('sets parameters from optional command args', () => {
    const spec = {};
    const command = {
      parent: {
        localStorage: {
          getItem: () => null
        }
      }
    };
    const commandInfo = {
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

    const options = apiExecuteOptionsFactory(
      spec,
      command,
      commandInfo,
      commandArgs
    );

    const foo = 'foo';
    expect(options.parameters[foo]).toBe(commandArgs.options.foo);
  });

  it('sets parameters from required command args', () => {
    const spec = {};
    const command = {
      parent: {
        localStorage: {
          getItem: () => null
        }
      }
    };
    const commandInfo = {
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

    const options = apiExecuteOptionsFactory(
      spec,
      command,
      commandInfo,
      commandArgs
    );

    const foo = 'foo';
    expect(options.parameters[foo]).toBe(commandArgs.foo);
  });

  it('sets request content type if specified', () => {
    const spec = {};
    const command = {
      parent: {
        localStorage: {
          getItem: () => null
        }
      }
    };
    const commandInfo = {
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

    const options = apiExecuteOptionsFactory(
      spec,
      command,
      commandInfo,
      commandArgs
    );

    expect(options.requestContentType).toBe(
      commandArgs.options['request-content-type']
    );
  });

  it('sets response content type if specified', () => {
    const spec = {};
    const command = {
      parent: {
        localStorage: {
          getItem: () => null
        }
      }
    };
    const commandInfo = {
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

    const options = apiExecuteOptionsFactory(
      spec,
      command,
      commandInfo,
      commandArgs
    );

    expect(options.responseContentType).toBe(
      commandArgs.options['response-content-type']
    );
  });

  it('sets securities from stored auth', () => {
    const spec = {};
    const command = {
      parent: {
        localStorage: {
          getItem: () => '{"foo_auth":"bar"}'
        }
      }
    };
    const commandInfo = {
      commandStringParts: null,
      operation: {
        operationId: null
      },
      pathKey: null
    };
    const commandArgs = {
      options: {}
    };

    const options = apiExecuteOptionsFactory(
      spec,
      command,
      commandInfo,
      commandArgs
    );

    expect(options.securities.foo_auth).toBe('bar');
  });
});

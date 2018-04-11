const _ = require('lodash');
const vorpal = require('vorpal');

const commandGroupTypes = require('../src/command-group-types');
const operationCommandBuilder = require('../src/operation-command-builder');

describe('operation-command-builder', () => {
  let vorpalInstance = null;

  afterEach(() => {
    vorpalInstance.ui.removeAllListeners();
  });

  it('adds option for request content type if operation specifies consumes values', () => {
    vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const commandInfo = {
      commandStringParts: [],
      operation: {
        consumes: ['foo', 'bar']
      },
      pathKey: null
    };

    const command = operationCommandBuilder(
      vorpalInstance,
      options,
      commandInfo
    );

    const option = _.find(command.options, {
      long: '--request-content-type'
    });

    expect(option).toBeTruthy();

    expect(option.autocomplete).toContain(commandInfo.operation.consumes[0]);
    expect(option.autocomplete).toContain(commandInfo.operation.consumes[1]);
  });

  it('adds option for response body output if operation specifies produces values', () => {
    vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const commandInfo = {
      commandStringParts: [],
      operation: {
        produces: ['foo', 'bar']
      },
      pathKey: null
    };

    const command = operationCommandBuilder(
      vorpalInstance,
      options,
      commandInfo
    );

    const option = _.find(command.options, { long: '--to-file' });

    expect(option).toBeTruthy();
  });

  it('adds option for response content type if operation specifies produces values', () => {
    vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const commandInfo = {
      commandStringParts: [],
      operation: {
        produces: ['foo', 'bar']
      },
      pathKey: null
    };

    const command = operationCommandBuilder(
      vorpalInstance,
      options,
      commandInfo
    );

    const option = _.find(command.options, {
      long: '--response-content-type'
    });

    expect(option).toBeTruthy();

    expect(option.autocomplete).toContain(commandInfo.operation.produces[0]);
    expect(option.autocomplete).toContain(commandInfo.operation.produces[1]);
  });

  it('adds options for optional parameters', () => {
    vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const commandInfo = {
      commandStringParts: [],
      operation: {
        parameters: [
          {
            description: 'description',
            items: {
              enum: ['foo', 'bar', 'baz']
            },
            name: 'foo',
            required: false
          }
        ]
      },
      pathKey: null
    };

    const command = operationCommandBuilder(
      vorpalInstance,
      options,
      commandInfo
    );

    const parameter = commandInfo.operation.parameters[0];
    const option = _.find(command.options, {
      long: `--${parameter.name}`
    });

    expect(option).toBeTruthy();

    expect(option.description).toBe(parameter.description);

    expect(option.autocomplete).toContain(parameter.items.enum[0]);
    expect(option.autocomplete).toContain(parameter.items.enum[1]);
    expect(option.autocomplete).toContain(parameter.items.enum[2]);
  });

  it('uses specified parts as command name', () => {
    vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const commandInfo = {
      commandStringParts: ['foo', 'bar'],
      operation: {
        operationId: null
      },
      pathKey: null
    };

    const command = operationCommandBuilder(
      vorpalInstance,
      options,
      commandInfo
    );

    expect(command._name).toBe(
      `${commandInfo.commandStringParts[0]} ${
        commandInfo.commandStringParts[1]
      }`
    );
  });

  it('uses operation summary as command description', () => {
    vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const commandInfo = {
      commandStringParts: [],
      operation: {
        operationId: null,
        summary: 'foo'
      },
      pathKey: null
    };

    const command = operationCommandBuilder(
      vorpalInstance,
      options,
      commandInfo
    );

    expect(command._description).toBe(commandInfo.operation.summary);
  });

  it('sets alias from operation id if operation commands are being grouped', () => {
    vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: commandGroupTypes.Tag
      },
      spec: {}
    };

    const commandInfo = {
      commandStringParts: [],
      operation: {
        description: 'foo',
        operationId: 'fooBar'
      },
      pathKey: null
    };

    const command = operationCommandBuilder(
      vorpalInstance,
      options,
      commandInfo
    );

    expect(command._aliases).toContain('foo-bar');
  });

  it('sets no alias if operation commands are not being grouped', () => {
    vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const commandInfo = {
      commandStringParts: [],
      operation: {
        description: 'foo',
        operationId: 'fooBar'
      },
      pathKey: null
    };

    const command = operationCommandBuilder(
      vorpalInstance,
      options,
      commandInfo
    );

    expect(command._aliases).not.toContain('foo-bar');
  });
});

import * as _ from 'lodash';
import * as vorpal from 'vorpal';

import { CommandGroupTypes } from '../src/command-group-types';
import { OperationCommandBuilder } from '../src/operation-command-builder';

describe('operation-command-builder', () => {
  it('adds option for request content type if operation specifies consumes values', () => {
    const vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const swaggerClientPromise = null;

    const builder = new OperationCommandBuilder(swaggerClientPromise);

    const commandInfo = {
      commandStringParts: [],
      operation: {
        consumes: ['foo', 'bar']
      },
      pathKey: null
    };

    const command = builder.build(vorpalInstance, options, commandInfo);

    const option = _.find(command.options, { long: '--request-content-type' });

    expect(option).toBeTruthy();

    expect(option.autocomplete).toContain(commandInfo.operation.consumes[0]);
    expect(option.autocomplete).toContain(commandInfo.operation.consumes[1]);
  });

  it('adds option for response body output if operation specifies produces values', () => {
    const vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const swaggerClientPromise = null;

    const builder = new OperationCommandBuilder(swaggerClientPromise);

    const commandInfo = {
      commandStringParts: [],
      operation: {
        produces: ['foo', 'bar']
      },
      pathKey: null
    };

    const command = builder.build(vorpalInstance, options, commandInfo);

    const option = _.find(command.options, { long: '--to-file' });

    expect(option).toBeTruthy();
  });

  it('adds option for response content type if operation specifies produces values', () => {
    const vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const swaggerClientPromise = null;

    const builder = new OperationCommandBuilder(swaggerClientPromise);

    const commandInfo = {
      commandStringParts: [],
      operation: {
        produces: ['foo', 'bar']
      },
      pathKey: null
    };

    const command = builder.build(vorpalInstance, options, commandInfo);

    const option = _.find(command.options, { long: '--response-content-type' });

    expect(option).toBeTruthy();

    expect(option.autocomplete).toContain(commandInfo.operation.produces[0]);
    expect(option.autocomplete).toContain(commandInfo.operation.produces[1]);
  });

  it('adds options for optional parameters', () => {
    const vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const swaggerClientPromise = null;

    const builder = new OperationCommandBuilder(swaggerClientPromise);

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

    const command = builder.build(vorpalInstance, options, commandInfo);

    const parameter = commandInfo.operation.parameters[0];
    const option = _.find(command.options, { long: '--' + parameter.name });

    expect(option).toBeTruthy();

    expect(option.description).toBe(parameter.description);

    expect(option.autocomplete).toContain(parameter.items.enum[0]);
    expect(option.autocomplete).toContain(parameter.items.enum[1]);
    expect(option.autocomplete).toContain(parameter.items.enum[2]);
  });

  it('uses specified parts as command name', () => {
    const vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const swaggerClientPromise = null;

    const builder = new OperationCommandBuilder(swaggerClientPromise);

    const commandInfo = {
      commandStringParts: ['foo', 'bar'],
      operation: {
        operationId: null
      },
      pathKey: null
    };

    const command = builder.build(vorpalInstance, options, commandInfo);

    expect(command._name).toBe(
      commandInfo.commandStringParts[0] +
        ' ' +
        commandInfo.commandStringParts[1]
    );
  });

  it('uses operation summary as command description', () => {
    const vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const swaggerClientPromise = null;

    const builder = new OperationCommandBuilder(swaggerClientPromise);

    const commandInfo = {
      commandStringParts: [],
      operation: {
        operationId: null,
        summary: 'foo'
      },
      pathKey: null
    };

    const command = builder.build(vorpalInstance, options, commandInfo);

    expect(command._description).toBe(commandInfo.operation.summary);
  });

  it('sets alias from operation id if operation commands are being grouped', () => {
    const vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: CommandGroupTypes.Tag
      },
      spec: {}
    };

    const swaggerClientPromise = null;

    const builder = new OperationCommandBuilder(swaggerClientPromise);

    const commandInfo = {
      commandStringParts: [],
      operation: {
        description: 'foo',
        operationId: 'fooBar'
      },
      pathKey: null
    };

    const command = builder.build(vorpalInstance, options, commandInfo);

    expect(command._aliases).toContain('foo-bar');
  });

  it('sets no alias if operation commands are not being grouped', () => {
    const vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {}
    };

    const swaggerClientPromise = null;

    const builder = new OperationCommandBuilder(swaggerClientPromise);

    const commandInfo = {
      commandStringParts: [],
      operation: {
        description: 'foo',
        operationId: 'fooBar'
      },
      pathKey: null
    };

    const command = builder.build(vorpalInstance, options, commandInfo);

    expect(command._aliases).not.toContain('foo-bar');
  });
});

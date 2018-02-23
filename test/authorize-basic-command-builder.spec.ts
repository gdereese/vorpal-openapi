import * as vorpal from 'vorpal';

import { AuthorizeBasicCommandBuilder } from '../src/authorize-basic-command-builder';

describe('authorize-basic-command-builder', () => {
  it('adds command if security scheme is specified', () => {
    const vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {
        securityDefinitions: {
          bar_auth: {
            name: 'bar',
            type: 'basic'
          },
          foo_auth: {
            name: 'foo',
            type: 'basic'
          }
        }
      }
    };

    const builder = new AuthorizeBasicCommandBuilder();

    const commands = builder.build(vorpalInstance, options);

    expect(commands[0]._name).toBe('authorize bar-auth');
    expect(commands[1]._name).toBe('authorize foo-auth');
  });
});

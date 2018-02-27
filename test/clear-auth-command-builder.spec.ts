import * as vorpal from 'vorpal';

import { ClearAuthCommandBuilder } from '../src/clear-auth-command-builder';

describe('clear-auth-command-builder', () => {
  it('adds command for each scheme', () => {
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
            type: 'apiKey'
          }
        }
      }
    };

    const builder = new ClearAuthCommandBuilder();

    const commands = builder.build(vorpalInstance, options);

    expect(commands[0]._name).toBe('clear-auth bar-auth');
    expect(commands[1]._name).toBe('clear-auth foo-auth');
  });
});

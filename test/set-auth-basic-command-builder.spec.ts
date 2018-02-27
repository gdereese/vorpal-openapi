import * as vorpal from 'vorpal';

import { SetAuthBasicCommandBuilder } from '../src/set-auth-basic-command-builder';

describe('set-auth-basic-command-builder', () => {
  it('adds command for each basic scheme', () => {
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

    const builder = new SetAuthBasicCommandBuilder();

    const commands = builder.build(vorpalInstance, options);

    expect(commands[0]._name).toBe('set-auth bar-auth');
    expect(commands[1]._name).toBe('set-auth foo-auth');
  });
});

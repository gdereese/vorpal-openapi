import * as vorpal from 'vorpal';

import { SetAuthApiKeyCommandBuilder } from '../src/set-auth-api-key-command-builder';

describe('set-auth-api-key-command-builder', () => {
  let vorpalInstance = null;

  it('adds command for each apiKey scheme', () => {
    vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {
        securityDefinitions: {
          bar_auth: {
            name: 'bar',
            type: 'apiKey'
          },
          foo_auth: {
            name: 'foo',
            type: 'apiKey'
          }
        }
      }
    };

    const builder = new SetAuthApiKeyCommandBuilder();

    const commands = builder.build(vorpalInstance, options);

    expect(commands[0]._name).toBe('set-auth bar-auth');
    expect(commands[1]._name).toBe('set-auth foo-auth');
  });

  afterEach(() => {
    vorpalInstance.ui.removeAllListeners();
  });
});

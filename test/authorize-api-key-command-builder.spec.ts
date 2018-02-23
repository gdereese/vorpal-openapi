import * as vorpal from 'vorpal';

import { AuthorizeApiKeyCommandBuilder } from '../src/authorize-api-key-command-builder';

describe('authorize-api-key-command-builder', () => {
  it('adds command for each apiKey scheme', () => {
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
            type: 'apiKey'
          },
          foo_auth: {
            name: 'foo',
            type: 'apiKey'
          }
        }
      }
    };

    const builder = new AuthorizeApiKeyCommandBuilder();

    const commands = builder.build(vorpalInstance, options);

    expect(commands[0]._name).toBe('authorize bar-auth');
    expect(commands[1]._name).toBe('authorize foo-auth');
  });
});

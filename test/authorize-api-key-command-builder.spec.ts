import * as vorpal from 'vorpal';

import { AuthorizeApiKeyCommandBuilder } from '../src/authorize-api-key-command-builder';

describe('authorize-api-key-command-builder', () => {
  it('adds command if security scheme is specified', () => {
    const vorpalInstance = vorpal();
    const options = {
      operations: {
        groupBy: null
      },
      spec: {
        securityDefinitions: {
          foo: {
            name: 'foo',
            type: 'apiKey'
          }
        }
      }
    };

    const builder = new AuthorizeApiKeyCommandBuilder();

    const command = builder.build(vorpalInstance, options);

    expect(command._name).toBe(
      'authorize ' + options.spec.securityDefinitions.foo.name
    );
  });
});

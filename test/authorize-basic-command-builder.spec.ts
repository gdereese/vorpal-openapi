import * as vorpal from 'vorpal';

import { AuthorizeBasicCommandBuilder } from '../src/authorize-basic-command-builder';

describe('authorize-basic-command-builder', () => {
  it('adds command if security scheme is specified', () => {
    const vorpalInstance = vorpal();
    const options = {
      operations: {
        groupBy: null
      },
      spec: {
        securityDefinitions: {
          basic: {
            name: 'foo'
          }
        }
      }
    };

    const builder = new AuthorizeBasicCommandBuilder();

    const command = builder.build(vorpalInstance, options);

    expect(command._name).toBe(
      'authorize ' + options.spec.securityDefinitions.basic.name
    );
  });
});

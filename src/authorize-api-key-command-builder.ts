import * as _ from 'lodash';

import { AuthorizeApiKeyAction } from './authorize-api-key-action';
import { Options } from './options';
import { IVorpalBuilder } from './vorpal-builder';

export class AuthorizeApiKeyCommandBuilder implements IVorpalBuilder {
  public build(vorpal: any, options: Options): any[] {
    const commands = [];

    for (const schemeKey of _.keys(options.spec.securityDefinitions)) {
      const scheme = options.spec.securityDefinitions[schemeKey];
      if (scheme.type !== 'apiKey') {
        continue;
      }

      const command = vorpal
        .command(
          'authorize ' + _.kebabCase(schemeKey) + ' <value>',
          'Authorize requests using an API key'
        )
        .action(args => {
          const action = new AuthorizeApiKeyAction(vorpal.activeCommand);
          return action.run(args, schemeKey);
        });
      commands.push(command);
    }

    return commands;
  }
}

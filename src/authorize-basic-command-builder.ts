import * as _ from 'lodash';

import { AuthorizeBasicAction } from './authorize-basic-action';
import { Options } from './options';
import { IVorpalBuilder } from './vorpal-builder';

export class AuthorizeBasicCommandBuilder implements IVorpalBuilder {
  public build(vorpal: any, options: Options): any[] {
    const commands = [];

    for (const schemeKey of _.keys(options.spec.securityDefinitions)) {
      const scheme = options.spec.securityDefinitions[schemeKey];
      if (scheme.type !== 'basic') {
        continue;
      }

      const command = vorpal
        .command(
          'authorize ' + _.kebabCase(schemeKey) + ' <value>',
          'Authorize requests using basic authorization'
        )
        .action(args => {
          const action = new AuthorizeBasicAction(vorpal.activeCommand);
          return action.run(args, schemeKey);
        });
      commands.push(command);
    }

    return commands;
  }
}

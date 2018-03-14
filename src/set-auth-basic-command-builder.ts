import * as _ from 'lodash';

import { Options } from './options';
import { SetAuthStringAction } from './set-auth-string-action';
import { IVorpalBuilder } from './vorpal-builder';

export class SetAuthBasicCommandBuilder implements IVorpalBuilder {
  public build(vorpal: any, options: Options): any[] {
    const commands = [];

    for (const schemeKey of _.keys(options.spec.securityDefinitions)) {
      const scheme = options.spec.securityDefinitions[schemeKey];
      if (scheme.type !== 'basic') {
        continue;
      }

      const command = vorpal
        .command(
          `set-auth ${_.kebabCase(schemeKey)} <value>`,
          `Set basic authorization value for security scheme '${schemeKey}'`
        )
        .action(args => {
          const action = new SetAuthStringAction(vorpal.activeCommand);
          return action.run(args, schemeKey);
        });
      commands.push(command);
    }

    return commands;
  }
}

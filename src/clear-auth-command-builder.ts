import * as _ from 'lodash';

import { ClearAuthAction } from './clear-auth-action';
import { Options } from './options';
import { IVorpalBuilder } from './vorpal-builder';

export class ClearAuthCommandBuilder implements IVorpalBuilder {
  public build(vorpal: any, options: Options): any[] {
    const commands = [];

    for (const schemeKey of _.keys(options.spec.securityDefinitions)) {
      const scheme = options.spec.securityDefinitions[schemeKey];

      const command = vorpal
        .command(
          `clear-auth ${_.kebabCase(schemeKey)}`,
          `Clear authorization value for security scheme '${schemeKey}'`
        )
        .action(args => {
          const action = new ClearAuthAction(vorpal.activeCommand);
          return action.run(args, schemeKey);
        });
      commands.push(command);
    }

    return commands;
  }
}

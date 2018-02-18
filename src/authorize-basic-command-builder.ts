import * as _ from 'lodash';

import { AuthorizeBasicAction } from './authorize-basic-action';
import { Options } from './options';
import { IVorpalBuilder } from './vorpal-builder';

export class AuthorizeBasicCommandBuilder implements IVorpalBuilder {
  public build(vorpal: any, options: Options) {
    const scheme = _.find(options.spec.securityDefinitions, { type: 'basic' });
    if (!scheme) {
      return;
    }

    const command = vorpal
      .command(
        'authorize ' + _.kebabCase(scheme.name) + ' <value>',
        'Authorize requests using basic authorization'
      )
      .action(args => {
        const action = new AuthorizeBasicAction(vorpal.activeCommand);
        return action.run(args, scheme.name);
      });

    return command;
  }
}

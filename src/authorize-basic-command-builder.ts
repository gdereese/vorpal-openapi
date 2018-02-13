import * as _ from 'lodash';

import { AuthorizeBasicAction } from './authorize-basic-action';
import { Options } from './options';
import { IVorpalBuilder } from './vorpal-builder';

export class AuthorizeBasicCommandBuilder implements IVorpalBuilder {
  public build(vorpal: any, options: Options) {
    const basic = 'basic';

    const securitySchemeNames = _.keys(options.spec.securityDefinitions);
    if (!_.includes(securitySchemeNames, basic)) {
      return;
    }

    const scheme = options.spec.securityDefinitions[basic];

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

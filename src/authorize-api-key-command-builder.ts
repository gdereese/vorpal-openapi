import * as _ from 'lodash';

import { AuthorizeApiKeyAction } from './authorize-api-key-action';
import { Options } from './options';
import { IVorpalBuilder } from './vorpal-builder';

export class AuthorizeApiKeyCommandBuilder implements IVorpalBuilder {
  public build(vorpal: any, options: Options) {
    const scheme = _.find(options.spec.securityDefinitions, { type: 'apiKey' });
    if (!scheme) {
      return;
    }

    const command = vorpal
      .command(
        'authorize ' + _.kebabCase(scheme.name) + ' <value>',
        'Authorize requests using an API key'
      )
      .action(args => {
        const action = new AuthorizeApiKeyAction(vorpal.activeCommand);
        return action.run(args, scheme.name);
      });

    return command;
  }
}

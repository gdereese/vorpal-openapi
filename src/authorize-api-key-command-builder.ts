import * as _ from 'lodash';

import { AuthorizeApiKeyAction } from './authorize-api-key-action';
import { Options } from './options';

export class AuthorizeApiKeyCommandBuilder {
  constructor(private vorpal) {}

  public build(name: string, options: Options) {
    this.vorpal
      .command(
        'authorize ' + _.kebabCase(name) + ' <value>',
        'Authorize requests using an API key'
      )
      .action(args => {
        const action = new AuthorizeApiKeyAction(this.vorpal.activeCommand);
        return action.run(args, name);
      });
  }
}

import * as _ from 'lodash';

import { AuthorizeBasicAction } from './authorize-basic-action';
import { Options } from './options';

export class AuthorizeBasicCommandBuilder {
  constructor(private vorpal) {}

  public build(name: string, options: Options) {
    this.vorpal
      .command(
        'authorize ' + _.kebabCase(name) + ' <value>',
        'Authorize requests using basic authorization'
      )
      .action(args => {
        const action = new AuthorizeBasicAction(this.vorpal.activeCommand);
        action.run(args, name);
      });
  }
}

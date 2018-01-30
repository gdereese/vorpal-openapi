import * as _ from 'lodash';

import * as commandOptionNames from './command-option-names';
import { OperationCommandInfo } from './operation-command-info';

export class OperationCommandValidator {
  constructor(private commandInfo: OperationCommandInfo, private vorpal) {
  }

  public validate(args) {
    // display warning if specified response content type isn't included in operation.produces
    if (args.options[commandOptionNames.RESPONSE_CONTENT_TYPE] &&
      !_.includes(this.commandInfo.operation.produces, args.options[commandOptionNames.RESPONSE_CONTENT_TYPE])) {
        this.vorpal.log(this.vorpal.chalk.yellow('Warning: MIME type ' +
          args.options[commandOptionNames.RESPONSE_CONTENT_TYPE] +
          ' is not listed as a possible response content type.  It may not be accepted or honored by the server.'));
    }

    return true;
  }
}

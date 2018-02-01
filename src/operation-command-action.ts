import { Spinner } from 'cli-spinner';

import * as commandOptionNames from './command-option-names';
import { OperationCommandInfo } from './operation-command-info';

export class OperationCommandAction {
  constructor(
    private swaggerClientPromise,
    private commandInfo: OperationCommandInfo,
    private vorpal
  ) {}

  public run(args) {
    const self = this;

    this.swaggerClientPromise.then(client => {
      self.vorpal.log();

      const executeOptions = {
        operationId: self.commandInfo.operation.operationId,
        parameters: args
      };

      // if response-type is specified, set execute option
      if (args.options[commandOptionNames.RESPONSE_CONTENT_TYPE]) {
        const responseContentTypePropName = 'responseContentType';
        executeOptions[responseContentTypePropName] =
          args.options[commandOptionNames.RESPONSE_CONTENT_TYPE];
      }

      const spinner = new Spinner('Sending request...');
      spinner.setSpinnerString(10);
      spinner.start();

      return client
        .execute(executeOptions)
        .then(response => self.handleSuccessResponse(response, spinner))
        .catch(error => self.handleErrorResponse(error, spinner));
    });
  }

  private handleErrorResponse(error, spinner: Spinner) {
    spinner.stop(true);
    this.vorpal.log(
      this.vorpal.chalk.red(
        error.response.status + ' ' + error.response.statusText
      )
    );

    // if response is expected per the operation spec, display the response description
    const responseSpec = this.commandInfo.operation.responses[
      error.response.status
    ];
    if (responseSpec && responseSpec.description) {
      this.vorpal.log(this.vorpal.chalk.red(responseSpec.description));
    }

    this.vorpal.log(error.response.data);

    this.vorpal.log();
  }

  private handleSuccessResponse(response, spinner: Spinner) {
    spinner.stop(true);
    this.vorpal.log(
      this.vorpal.chalk.green(response.status + ' ' + response.statusText)
    );

    // if response is expected per the operation spec, display the response description
    const responseSpec = this.commandInfo.operation.responses[response.status];
    if (responseSpec && responseSpec.description) {
      this.vorpal.log(this.vorpal.chalk.green(responseSpec.description));
    }

    this.vorpal.log(response.data);

    this.vorpal.log();
  }
}

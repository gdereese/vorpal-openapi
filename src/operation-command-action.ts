import { Spinner } from 'cli-spinner';
import * as _ from 'lodash';

import * as commandOptionNames from './command-option-names';
import * as localStorageKeys from './local-storage-keys';
import { OperationCommandInfo } from './operation-command-info';
import { Options } from './options';
import { SwaggerExecuteOptionsFactory } from './swagger-execute-options-factory';

export class OperationCommandAction {
  constructor(
    private swaggerClientPromise,
    private commandInfo: OperationCommandInfo,
    private command
  ) {}

  public run(args, options: Options) {
    const self = this;

    this.swaggerClientPromise.then(client => {
      this.command.log();

      const executeOptionsFactory = new SwaggerExecuteOptionsFactory();
      const executeOptions = executeOptionsFactory.create(
        this.command,
        this.commandInfo,
        args
      );

      const spinner = new Spinner('Sending request...');
      spinner.setSpinnerString(10);
      spinner.start();

      // TODO: change to return response string (instead of writing to log); perhaps commands could then be piped?
      return client
        .execute(executeOptions)
        .then(response => self.handleSuccessResponse(response, spinner))
        .catch(error => self.handleErrorResponse(error, spinner));
    });
  }

  private handleErrorResponse(error, spinner: Spinner) {
    spinner.stop(true);
    this.command.log(
      this.command.parent.chalk.red(
        error.response.status + ' ' + error.response.statusText
      )
    );

    // if response is expected per the operation spec, display the response description
    const responseSpec = this.commandInfo.operation.responses[
      error.response.status
    ];
    if (responseSpec && responseSpec.description) {
      this.command.log(this.command.parent.chalk.red(responseSpec.description));
    }

    this.command.log(error.response.data);

    this.command.log();
  }

  private handleSuccessResponse(response, spinner: Spinner) {
    spinner.stop(true);
    this.command.log(
      this.command.parent.chalk.green(
        response.status + ' ' + response.statusText
      )
    );

    // if response is expected per the operation spec, display the response description
    const responseSpec = this.commandInfo.operation.responses[response.status];
    if (responseSpec && responseSpec.description) {
      this.command.log(
        this.command.parent.chalk.green(responseSpec.description)
      );
    }

    this.command.log(response.data);

    this.command.log();
  }
}

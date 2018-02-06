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
      spinner.setSpinnerString(18);
      spinner.start();

      // TODO: change to return response string (instead of writing to log); perhaps commands could then be piped?
      return client
        .execute(executeOptions)
        .then(response =>
          self.handleResponse(
            response,
            spinner,
            this.command.parent.chalk.green
          )
        )
        .catch(error =>
          self.handleResponse(
            error.response,
            spinner,
            this.command.parent.chalk.red
          )
        );
    });
  }

  private handleResponse(response, spinner: Spinner, chalkColor) {
    spinner.stop(true);

    let result = response.status + ' ' + response.statusText;
    // if response is expected per the operation spec, display the response description
    const responseSpec = this.commandInfo.operation.responses[response.status];
    if (responseSpec && responseSpec.description) {
      result += ': ' + responseSpec.description;
    }
    this.command.log(chalkColor(result));

    let responseString: string = null;
    if (typeof response.data === 'string') {
      responseString = response.data;
    } else if (response.data instanceof Buffer) {
      responseString = (response.data as Buffer).toString();
    }
    if (responseString && responseString.length > 0) {
      this.command.log(responseString);
    }

    this.command.log();
  }
}

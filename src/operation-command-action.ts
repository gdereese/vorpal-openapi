import * as fs from 'fs';
import * as ora from 'ora';

import { ApiExecuteOptionsFactory } from './api-execute-options-factory';
import * as commandOptionNames from './command-option-names';
import * as localStorageKeys from './local-storage-keys';
import { OperationCommandInfo } from './operation-command-info';
import { Options } from './options';

export class OperationCommandAction {
  constructor(
    private swaggerClientPromise,
    private commandInfo: OperationCommandInfo,
    private command
  ) {}

  public run(args, options: Options): Promise<any> {
    const self = this;

    return this.swaggerClientPromise.then(client => {
      this.command.log();

      const executeOptionsFactory = new ApiExecuteOptionsFactory();
      const executeOptions = executeOptionsFactory.create(
        this.command,
        this.commandInfo,
        args
      );

      const spinner = ora('Sending request...');
      spinner.start();

      // TODO: change to return response string (instead of writing to log); perhaps commands could then be piped?
      return client
        .execute(executeOptions)
        .then(response => {
          return self.handleResponse(
            response,
            spinner,
            this.command.parent.chalk.green,
            args.options['to-file']
          );
        })
        .catch(error => {
          return self.handleResponse(
            error.response,
            spinner,
            this.command.parent.chalk.red,
            args.options['to-file']
          );
        });
    });
  }

  private handleResponse(
    response,
    spinner: any,
    chalkColor,
    bodyPath: string
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let result = response.status + ' ' + response.statusText;
      // if response is expected per the operation spec, display the response description
      const responseSpec = this.commandInfo.operation.responses[
        response.status
      ];
      if (responseSpec && responseSpec.description) {
        result += ': ' + responseSpec.description;
      }

      if (response.status >= 200 && response.status <= 299) {
        spinner.succeed(chalkColor(result));
      } else {
        spinner.fail(chalkColor(result));
      }

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

      // if body need to be written to file, resolve promise using writeFile callback;
      // otherwise, resolve it now
      if (bodyPath) {
        fs.writeFile(bodyPath, responseString, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

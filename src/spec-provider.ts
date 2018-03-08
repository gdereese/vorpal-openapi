import axios from 'axios';
import * as fs from 'fs';
import * as ora from 'ora';

export class SpecProvider {
  public getSpec(pathOrUrl: string): Promise<any> {
    if (!pathOrUrl) {
      return Promise.reject('Spec path or URL was not specified.');
    }

    const isUrl = this.isUrl(pathOrUrl);

    if (isUrl) {
      return this.getSpecFromUrl(pathOrUrl);
    } else {
      return this.getSpecFromPath(pathOrUrl);
    }
  }

  private getSpecFromPath(path: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(JSON.parse(data.toString()));
        }
      });
    });
  }

  private getSpecFromUrl(url: string): Promise<any> {
    const spinner = ora('Downloading spec...').start();

    return axios
      .get(url)
      .then(response => {
        spinner.stop();

        return response.data;
      })
      .catch(err => {
        spinner.stop();

        const errorMessage =
          "Error retrieving '" +
          url +
          "': " +
          err.response.status +
          ' ' +
          err.response.statusText;

        throw errorMessage;
      });
  }

  private isUrl(str: string): boolean {
    const urlPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;

    return urlPattern.test(str);
  }
}

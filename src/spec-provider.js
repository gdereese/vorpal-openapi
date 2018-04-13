const axios = require('axios');
const fs = require('fs');
const isUrl = require('is-url');
const ora = require('ora');
const SwaggerParser = require('swagger-parser');

function specProvider(pathOrUrl) {
  if (!pathOrUrl) {
    return Promise.reject('Spec path or URL was not specified.');
  }

  const getSpec = isUrl(pathOrUrl)
    ? getSpecFromUrl(pathOrUrl)
    : getSpecFromPath(pathOrUrl);

  return getSpec
    .then(spec => {
      return Promise.all([spec, SwaggerParser.validate(spec)]);
    })
    .then(results => {
      return results[0];
    });
}

function getSpecFromPath(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        switch (err.code) {
          case 'ENOENT':
            reject(new Error(`Spec file '${path}' was not found.`));
            break;
          default:
            reject(err);
        }
      } else {
        resolve(JSON.parse(data.toString()));
      }
    });
  });
}

function getSpecFromUrl(url) {
  const spinner = ora('Downloading spec...').start();

  return axios
    .get(url)
    .then(response => {
      spinner.stop();

      return response.data;
    })
    .catch(err => {
      spinner.stop();

      throw new Error(
        `Error retrieving '${url}': ${err.response.status} ${
          err.response.statusText
        }`
      );
    });
}

module.exports = specProvider;

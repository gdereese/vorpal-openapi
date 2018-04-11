const axios = require('axios');
const fs = require('fs');
const isUrl = require('is-url');
const ora = require('ora');

function specProvider(pathOrUrl) {
  if (!pathOrUrl) {
    return Promise.reject('Spec path or URL was not specified.');
  }

  if (isUrl(pathOrUrl)) {
    return getSpecFromUrl(pathOrUrl);
  } else {
    return getSpecFromPath(pathOrUrl);
  }
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

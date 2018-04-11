const axios = require('axios');
const fs = require('fs');
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
        reject(err.message);
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

      const errorMessage = `Error retrieving '${url}': ${err.response.status} ${
        err.response.statusText
      }`;

      throw errorMessage;
    });
}

function isUrl(str) {
  const urlPattern = new RegExp(
    '^(?:\\w+:)?//([^\\s.]+\\.\\S{2}|localhost[\\:?\\d]*)\\S*$'
  );

  return urlPattern.test(str);
}

module.exports = specProvider;

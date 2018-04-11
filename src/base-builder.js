const _ = require('lodash');

function baseBuilder(vorpal, options) {
  const infoSpec = options.spec.info;

  let delimiter;
  if (infoSpec.title) {
    delimiter = `${_.kebabCase(infoSpec.title)}$`;
  } else {
    delimiter = 'vorpal-openapi$';
  }
  vorpal.delimiter(delimiter);

  let historyString;
  if (infoSpec.title) {
    historyString = _.kebabCase(infoSpec.title);
  } else {
    historyString = `vorpal-openapi-${process.pid}`;
  }
  vorpal.history(historyString);

  let localStorageString;
  if (infoSpec.title) {
    localStorageString = _.kebabCase(infoSpec.title);
  } else {
    localStorageString = `vorpal-openapi-${process.pid}`;
  }
  vorpal.localStorage(localStorageString);
}

module.exports = baseBuilder;

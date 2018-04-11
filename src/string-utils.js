const _ = require('lodash');

function joinNonEmpty(strings, delimiter) {
  const nonEmptyStrings = _.filter(strings, str => {
    return !_.isNil(str);
  });

  return nonEmptyStrings.join(delimiter);
}

module.exports = {
  joinNonEmpty
};

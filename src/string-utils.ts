import * as _ from 'lodash';

export function joinNonEmpty(strings: string[], delimiter: string): string {
  const nonEmptyStrings = _.filter(strings, str => {
    return !_.isNil(str);
  });

  return nonEmptyStrings.join(delimiter);
}

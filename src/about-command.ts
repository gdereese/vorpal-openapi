import * as _ from 'lodash';

import * as stringUtils from './string-utils';
import { TextBuilder } from './text-builder';

export function run(vorpal, info, callback) {
  const infoBuilder = new TextBuilder();

  infoBuilder.addLine();

  const version = info.version ? 'Version ' + info.version : '';
  const heading = stringUtils.joinNonEmpty([info.title, version], '\n');
  infoBuilder.addParagraph(heading);

  let contact = stringUtils.joinNonEmpty([info.contact.name, info.contact.url, info.contact.email], ' • ');
  if (contact.length > 0) {
    contact = 'Contact:\n' + contact;
  }
  infoBuilder.addParagraph(contact);

  if (info.termsOfService) {
    infoBuilder.addParagraph('Terms of Service:\n' + info.termsOfService);
  }

  infoBuilder.addLine();

  vorpal.log(infoBuilder.toString());
  callback();
}

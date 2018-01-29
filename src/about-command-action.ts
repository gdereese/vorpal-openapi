import * as _ from 'lodash';

import { CommandInfo } from './command-info';
import * as stringUtils from './string-utils';
import { TextBuilder } from './text-builder';

export class AboutCommandAction {
  constructor(private infoSpec, private vorpal) {
  }

  public run(args, callback) {
    const infoBuilder = new TextBuilder();

    infoBuilder.addLine();

    const version = this.infoSpec.version ? 'Version ' + this.infoSpec.version : '';
    const heading = stringUtils.joinNonEmpty([this.infoSpec.title, version], '\n');
    infoBuilder.addParagraph(heading);

    let contact = stringUtils.joinNonEmpty([
      this.infoSpec.contact.name,
      this.infoSpec.contact.url,
      this.infoSpec.contact.email,
    ], ' • ');
    if (contact.length > 0) {
      contact = 'Contact:\n' + contact;
    }
    infoBuilder.addParagraph(contact);

    if (this.infoSpec.termsOfService) {
      infoBuilder.addParagraph('Terms of Service:\n' + this.infoSpec.termsOfService);
    }

    infoBuilder.addLine();

    this.vorpal.log(infoBuilder.toString());

    callback();
  }
}

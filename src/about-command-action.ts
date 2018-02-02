import * as _ from 'lodash';

import * as stringUtils from './string-utils';
import { TextBuilder } from './text-builder';

export class AboutCommandAction {
  constructor(private command) {}

  public run(infoSpec): Promise<any> {
    return new Promise((resolve, reject) => {
      const infoBuilder = new TextBuilder();

      infoBuilder.addLine();

      const version = infoSpec.version ? 'Version ' + infoSpec.version : '';
      const heading = stringUtils.joinNonEmpty([infoSpec.title, version], '\n');
      infoBuilder.addParagraph(heading);

      let contact = stringUtils.joinNonEmpty(
        [infoSpec.contact.name, infoSpec.contact.url, infoSpec.contact.email],
        ' • '
      );
      if (contact.length > 0) {
        contact = 'Contact:\n' + contact;
      }
      infoBuilder.addParagraph(contact);

      if (infoSpec.termsOfService) {
        infoBuilder.addParagraph(
          'Terms of Service:\n' + infoSpec.termsOfService
        );
      }

      infoBuilder.addLine();

      this.command.log(infoBuilder.toString());

      resolve();
    });
  }
}

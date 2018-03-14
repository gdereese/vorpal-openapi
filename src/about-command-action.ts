import * as _ from 'lodash';
import * as StringBuilder from 'string-builder';

import * as stringUtils from './string-utils';

export class AboutCommandAction {
  constructor(private command) {}

  public run(infoSpec): Promise<any> {
    const infoBuilder = new StringBuilder();

    infoBuilder.append(infoSpec.title ? `\n${infoSpec.title}` : '');
    infoBuilder.append(infoSpec.version ? `\nVersion ${infoSpec.version}` : '');

    infoBuilder.append(
      infoSpec.description ? `\n\n${infoSpec.description}` : ''
    );

    if (infoSpec.contact) {
      const contact = stringUtils.joinNonEmpty(
        [infoSpec.contact.name, infoSpec.contact.url, infoSpec.contact.email],
        ' • '
      );
      infoBuilder.append(contact.length > 0 ? `\n\nContact:\n${contact}` : '');
    }

    infoBuilder.append(
      infoSpec.termsOfService
        ? `\n\nTerms of Service:\n${infoSpec.termsOfService}`
        : ''
    );

    infoBuilder.appendLine();

    this.command.log(infoBuilder.toString());

    return Promise.resolve();
  }
}

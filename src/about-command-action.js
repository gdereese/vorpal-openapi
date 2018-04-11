const StringBuilder = require('string-builder');

const stringUtils = require('./string-utils');

function aboutCommandAction(command, infoSpec) {
  const infoBuilder = new StringBuilder();

  infoBuilder.append(infoSpec.title ? `\n${infoSpec.title}` : '');
  infoBuilder.append(infoSpec.version ? `\nVersion ${infoSpec.version}` : '');

  infoBuilder.append(infoSpec.description ? `\n\n${infoSpec.description}` : '');

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

  command.log(infoBuilder.toString());

  return Promise.resolve();
}

module.exports = aboutCommandAction;

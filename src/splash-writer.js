const StringBuilder = require('string-builder');

function splashWriter(vorpal, options) {
  // TODO: need to do better null checking of full path of properties

  // don't show the splash screen stuff in non-interactive mode
  if (!options.interactive) {
    return;
  }

  const splashBuilder = new StringBuilder();

  splashBuilder.append(
    options.spec.info.title ? `\n${options.spec.info.title}` : ''
  );
  splashBuilder.append(
    options.spec.info.version ? `\nVersion ${options.spec.info.version}` : ''
  );

  splashBuilder.appendLine();

  vorpal.log(splashBuilder.toString());
}

module.exports = splashWriter;

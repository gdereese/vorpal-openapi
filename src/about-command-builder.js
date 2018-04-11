const aboutCommandAction = require('./about-command-action');

function aboutCommandBuilder(vorpal, options) {
  const infoSpec = options.spec.info;

  if (infoSpec) {
    const command = vorpal
      .command('about', 'Displays information about the API.')
      .action(() => aboutCommandAction(vorpal, infoSpec));

    return command;
  }
}

module.exports = aboutCommandBuilder;

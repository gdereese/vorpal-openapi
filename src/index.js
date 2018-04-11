#!/usr/bin/env node

const _ = require('lodash');
const vorpal = require('vorpal');

const commandGroupTypes = require('./command-group-types');
const extension = require('./extension');
const specProvider = require('./spec-provider');

const specPathOrUrlArgIndex = 2;

const specPathOrUrl = process.argv[specPathOrUrlArgIndex];

specProvider(specPathOrUrl)
  .then(spec => {
    // remove 3rd argument from those passed to this command (path to spec)
    // so that vorpal doesn't try to parse it
    _.pullAt(process.argv, specPathOrUrlArgIndex);

    const extensionOptions = {
      interactive: process.argv.length === 2,
      operations: {
        groupBy: commandGroupTypes.Tag
      },
      spec
    };

    const vorpalInstance = vorpal()
      .use(extension, extensionOptions)
      .parse(process.argv);

    if (extensionOptions.interactive) {
      vorpalInstance.show();
    }
  })
  .catch(errorMessage => {
    console.error(errorMessage);
    console.log();

    throw new Error(errorMessage);
  });

module.exports = extension;

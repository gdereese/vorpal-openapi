#!/usr/bin/env node

import * as _ from 'lodash';
import * as vorpal from 'vorpal';

import { CommandGroupTypes } from './command-group-types';
import * as VorpalOpenApiExtension from './extension';
import { Options } from './options';
import { SpecProvider } from './spec-provider';

export default VorpalOpenApiExtension.use;

const specPathOrUrlArgIndex = 2;

const specPathOrUrl = process.argv[specPathOrUrlArgIndex];

const specProvider = new SpecProvider();
specProvider
  .getSpec(specPathOrUrl)
  .then(spec => {
    // remove 3rd argument from those passed to this command (path to spec)
    // so that vorpal doesn't try to parse it
    _.pullAt(process.argv, specPathOrUrlArgIndex);

    const extensionOptions: Options = {
      interactive: process.argv.length === 2,
      operations: {
        groupBy: CommandGroupTypes.Tag
      },
      spec
    };

    const vorpalInstance = vorpal()
      .use(VorpalOpenApiExtension.use, extensionOptions)
      .parse(process.argv);

    if (extensionOptions.interactive) {
      vorpalInstance.show();
    }
  })
  .catch(errorMessage => {
    console.log();
    console.error(errorMessage);
    console.log();

    process.exit(1);
  });

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
    const vorpalOpenApiOptions: Options = {
      operations: {
        groupBy: CommandGroupTypes.Tag
      },
      spec
    };

    // remove 3rd argument from those passed to this command (path to spec)
    // so that vorpal doesn't try to parse it
    _.pullAt(process.argv, specPathOrUrlArgIndex);

    vorpal()
      .use(VorpalOpenApiExtension.use, vorpalOpenApiOptions)
      .show()
      .parse(process.argv);
  })
  .catch(errorMessage => {
    console.log();
    console.error(errorMessage);
    console.log();

    process.exit(1);
  });

import { AboutCommandBuilder } from './about-command-builder';
import { AuthorizeApiKeyCommandBuilder } from './authorize-api-key-command-builder';
import { AuthorizeBasicCommandBuilder } from './authorize-basic-command-builder';
import { BaseBuilder } from './base-builder';
import { OperationCommandsBuilder } from './operation-commands-builder';
import { Options } from './options';
import { SplashWriter } from './splash-writer';

export function use(vorpal, options: Options) {
  vorpal
    .use(new BaseBuilder().build, options)
    .use(new AboutCommandBuilder().build, options)
    .use(new AuthorizeApiKeyCommandBuilder().build, options)
    .use(new AuthorizeBasicCommandBuilder().build, options)
    .use(new OperationCommandsBuilder().build, options)
    .use(new SplashWriter().build, options);
}

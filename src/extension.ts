import { AboutCommandBuilder } from './about-command-builder';
import { BaseBuilder } from './base-builder';
import { ClearAuthCommandBuilder } from './clear-auth-command-builder';
import { OperationCommandsBuilder } from './operation-commands-builder';
import { Options } from './options';
import { SetAuthApiKeyCommandBuilder } from './set-auth-api-key-command-builder';
import { SetAuthBasicCommandBuilder } from './set-auth-basic-command-builder';
import { SplashWriter } from './splash-writer';

export function use(vorpal, options: Options) {
  vorpal
    .use(new BaseBuilder().build, options)
    .use(new AboutCommandBuilder().build, options)
    .use(new SetAuthApiKeyCommandBuilder().build, options)
    .use(new SetAuthBasicCommandBuilder().build, options)
    .use(new ClearAuthCommandBuilder().build, options)
    .use(new OperationCommandsBuilder().build, options)
    .use(new SplashWriter().build, options);
}

import * as StringBuilder from 'string-builder';

import { Options } from './options';
import * as stringUtils from './string-utils';
import { IVorpalBuilder } from './vorpal-builder';

export class SplashWriter implements IVorpalBuilder {
  public build(vorpal: any, options: Options) {
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
}

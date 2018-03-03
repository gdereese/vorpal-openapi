import { Options } from './options';
import * as stringUtils from './string-utils';
import { TextBuilder } from './text-builder';
import { IVorpalBuilder } from './vorpal-builder';

export class SplashWriter implements IVorpalBuilder {
  public build(vorpal: any, options: Options) {
    // TODO: need to do better null checking of full path of properties

    // don't show the splash screen stuff in non-interactive mode
    if (!options.interactive) {
      return;
    }

    const splashBuilder = new TextBuilder();

    const version = options.spec.info.version
      ? 'Version ' + options.spec.info.version
      : '';
    const heading = stringUtils.joinNonEmpty(
      [options.spec.info.title, version],
      '\n'
    );
    splashBuilder.addParagraph(heading);

    splashBuilder.addLine();

    vorpal.log(splashBuilder.toString());
  }
}

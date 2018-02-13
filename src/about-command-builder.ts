import { AboutCommandAction } from './about-command-action';
import { Options } from './options';
import { IVorpalBuilder } from './vorpal-builder';

export class AboutCommandBuilder implements IVorpalBuilder {
  public build(vorpal: any, options: Options) {
    const infoSpec = options.spec.info;

    if (infoSpec) {
      vorpal
        .command('about', 'Displays information about the API.')
        .action(args => {
          const action = new AboutCommandAction(vorpal);
          return action.run(infoSpec);
        });
    }
  }
}

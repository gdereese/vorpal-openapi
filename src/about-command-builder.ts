import { AboutCommandAction } from './about-command-action';

export class AboutCommandBuilder {
  constructor(private vorpal) {}

  public build(infoSpec) {
    this.vorpal
      .command('about', 'Displays information about the API.')
      .action(args => {
        const action = new AboutCommandAction(this.vorpal);
        return action.run(infoSpec);
      });
  }
}

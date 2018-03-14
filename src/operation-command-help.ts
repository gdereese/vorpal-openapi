import * as _ from 'lodash';
import * as StringBuilder from 'string-builder';

import { OperationCommandInfo } from './operation-command-info';

export class OperationCommandHelp {
  constructor(private command, private commandInfo: OperationCommandInfo) {}

  public build(command: string): string {
    const helpBuilder = new StringBuilder();

    // add the operation summary to the command description so it can be
    // displayed using the default help logic, then reset to the original
    // value afterwards
    const oldDescription = this.command._description;
    if (
      this.commandInfo.operation.description &&
      this.commandInfo.operation.description.length > 0
    ) {
      this.command._description += `\n\n  ${
        this.commandInfo.operation.description
      }`;
    }
    helpBuilder.append(this.command.helpInformation());
    this.command._description = oldDescription;

    // list security requirements (and any required scopes)
    if (
      this.commandInfo.operation.security &&
      this.commandInfo.operation.security.length > 0
    ) {
      const securityListBuilder = new StringBuilder();

      for (const requirement of this.commandInfo.operation.security) {
        securityListBuilder.append('    - ');

        const andSchemeNames = _.keys(requirement);
        for (
          let nameIndex = 0;
          nameIndex < andSchemeNames.length;
          nameIndex++
        ) {
          const name = andSchemeNames[nameIndex];

          if (nameIndex > 0) {
            securityListBuilder.append('\n      ');
          }

          securityListBuilder.append(name);

          const scopes = requirement[name];
          if (scopes && scopes.length > 0) {
            securityListBuilder.append(` (${scopes.join(', ')})`);
          }
        }
      }

      helpBuilder.append(
        `\n  Required Security:\n\n${securityListBuilder.toString()}`
      );
      helpBuilder.appendLine();
    }

    return helpBuilder.toString();
  }
}

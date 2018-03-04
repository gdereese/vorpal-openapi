import * as _ from 'lodash';

import { OperationCommandInfo } from './operation-command-info';
import { TextBuilder } from './text-builder';

export class OperationCommandHelp {
  constructor(private command, private commandInfo: OperationCommandInfo) {}

  public build(command: string): string {
    const helpBuilder = new TextBuilder();

    // add the operation summary to the command description so it can be
    // displayed using the default help logic, then reset to the original
    // value afterwards
    const oldDescription = this.command._description;
    if (
      this.commandInfo.operation.description &&
      this.commandInfo.operation.description.length > 0
    ) {
      this.command._description +=
        '\n\n  ' + this.commandInfo.operation.description;
    }
    helpBuilder.add(this.command.helpInformation());
    this.command._description = oldDescription;

    // list security requirements (and any required scopes)
    if (
      this.commandInfo.operation.security &&
      this.commandInfo.operation.security.length > 0
    ) {
      let securityList = '';

      for (const requirement of this.commandInfo.operation.security) {
        securityList += '    - ';

        const andSchemeNames = _.keys(requirement);
        for (
          let nameIndex = 0;
          nameIndex < andSchemeNames.length;
          nameIndex++
        ) {
          const name = andSchemeNames[nameIndex];

          if (nameIndex > 0) {
            securityList += '\n      ';
          }

          securityList += name;

          const scopes = requirement[name];
          if (scopes && scopes.length > 0) {
            securityList += ' (' + scopes.join(', ') + ')';
          }
        }
      }

      helpBuilder.addParagraph('  Required Security:\n\n' + securityList, '\n');
      helpBuilder.addLine();
    }

    return helpBuilder.toString();
  }
}

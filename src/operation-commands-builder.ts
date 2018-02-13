import * as _ from 'lodash';

import * as commandGroupTypes from './command-group-types';
import { OperationCommandBuilder } from './operation-command-builder';
import { OperationCommandInfo } from './operation-command-info';
import { Options } from './options';
import { IVorpalBuilder } from './vorpal-builder';

export class OperationCommandsBuilder implements IVorpalBuilder {
  public build(vorpal: any, options: Options) {
    let commandInfos = [];
    switch ((options.operations.groupBy || '').toLowerCase()) {
      case commandGroupTypes.PATH:
        commandInfos = getCommandInfosByPaths(options.spec);
        break;
      case commandGroupTypes.TAG:
        commandInfos = getCommandInfosByTags(options.spec);
        break;
      default:
        commandInfos = getCommandInfosForDefault(options.spec);
        break;
    }

    // sort commands by command string parts;
    // this will ensure any that should be grouped together are listed consecutively
    const sortedCommandInfos = _.sortBy(
      commandInfos,
      (commandInfo: OperationCommandInfo) => {
        return (
          commandInfo.commandStringParts[0] +
          ' ' +
          (commandInfo.commandStringParts[1] || '')
        );
      }
    );

    const commandBuilder = new OperationCommandBuilder();
    for (const info of sortedCommandInfos) {
      commandBuilder.build(vorpal, options, info);
    }
  }
}

function getCommandInfosByPaths(spec): OperationCommandInfo[] {
  const infos = [];

  const pathKeys = _.keys(spec.paths);
  for (const pathKey of pathKeys) {
    const path = spec.paths[pathKey];

    const operationKeys = _.keys(path);
    for (const operationKey of operationKeys) {
      const operation = path[operationKey];

      // split path into parts by slash (trim off if the path starts with one)
      const pathKeyParts = _.trimStart(pathKey, '/').split('/');

      infos.push({
        commandStringParts: [
          _.kebabCase(pathKeyParts[0]),
          _.kebabCase(operation.operationId)
        ],
        operation,
        pathKey
      });
    }
  }

  return infos;
}

function getCommandInfosByTags(spec): OperationCommandInfo[] {
  const infos = [];

  const pathKeys = _.keys(spec.paths);
  for (const pathKey of pathKeys) {
    const path = spec.paths[pathKey];

    const operationKeys = _.keys(path);
    for (const operationKey of operationKeys) {
      const operation = path[operationKey];

      for (const tagName of operation.tags) {
        infos.push({
          commandStringParts: [
            _.kebabCase(tagName),
            _.kebabCase(operation.operationId)
          ],
          operation,
          pathKey
        });
      }
    }
  }

  return infos;
}

function getCommandInfosForDefault(spec): OperationCommandInfo[] {
  const infos = [];

  const pathKeys = _.keys(spec.paths);
  for (const pathKey of pathKeys) {
    const path = spec.paths[pathKey];

    const operationKeys = _.keys(path);
    for (const operationKey of operationKeys) {
      const operation = path[operationKey];

      infos.push({
        commandStringParts: [_.kebabCase(operation.operationId)],
        operation,
        pathKey
      });
    }
  }

  return infos;
}

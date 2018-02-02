import * as _ from 'lodash';

import { AboutCommandBuilder } from './about-command-builder';
import { AuthorizeApiKeyCommandBuilder } from './authorize-api-key-command-builder';
import { AuthorizeBasicCommandBuilder } from './authorize-basic-command-builder';
import * as commandGroupTypes from './command-group-types';
import { OperationCommandBuilder } from './operation-command-builder';
import { OperationCommandInfo } from './operation-command-info';
import { Options } from './options';
import * as stringUtils from './string-utils';
import { TextBuilder } from './text-builder';

export function build(vorpal, options: Options) {
  const infoSpec = options.spec.info;

  let delimiter;
  if (infoSpec.title) {
    delimiter = _.kebabCase(infoSpec.title) + '$';
  } else {
    delimiter = 'vorpal-swagger$';
  }
  vorpal.delimiter(delimiter);

  let historyString;
  if (infoSpec.title) {
    historyString = _.kebabCase(infoSpec.title);
  } else {
    historyString = 'vorpal-swagger-' + process.pid;
  }
  vorpal.history(historyString);

  let localStorageString;
  if (infoSpec.title) {
    localStorageString = _.kebabCase(infoSpec.title);
  } else {
    localStorageString = 'vorpal-swagger-' + process.pid;
  }
  vorpal.localStorage(localStorageString);

  if (infoSpec) {
    const aboutCommandBuilder = new AboutCommandBuilder(vorpal);
    aboutCommandBuilder.build(infoSpec);
  }

  // add an authorize command for each security scheme
  const securitySchemeNames = _.keys(options.spec.securityDefinitions);
  const apiKeyAuthorizeCommandBuilder = new AuthorizeApiKeyCommandBuilder(
    vorpal
  );
  const basicAuthorizeCommandBuilder = new AuthorizeBasicCommandBuilder(vorpal);
  for (const name of securitySchemeNames) {
    const securityScheme = options.spec.securityDefinitions[name];

    switch (securityScheme.type) {
      case 'apiKey':
        apiKeyAuthorizeCommandBuilder.build(name, options);
        break;
      case 'basic':
        basicAuthorizeCommandBuilder.build(name, options);
        break;
      default:
        break;
    }
  }

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

  const operationCommandBuilder = new OperationCommandBuilder(vorpal, options);
  for (const info of sortedCommandInfos) {
    const command = operationCommandBuilder.build(info);
  }

  writeSplash(vorpal, options);
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

function writeSplash(vorpal, options: Options) {
  // TODO: need to do better null checking of full path of properties

  const splashBuilder = new TextBuilder();

  splashBuilder.addLine();

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

const _ = require('lodash');
const ora = require('ora');

const commandGroupTypes = require('./command-group-types');
const operationCommandBuilder = require('./operation-command-builder');

function operationCommandsBuilder(vorpal, options) {
  const spinner = ora('Adding commands from spec...');
  spinner.start();

  let commandInfos = [];
  switch (options.operations.groupBy) {
    case commandGroupTypes.Path:
      commandInfos = getCommandInfosByPaths(options.spec);
      break;
    case commandGroupTypes.Tag:
      commandInfos = getCommandInfosByTags(options.spec);
      break;
    default:
      commandInfos = getCommandInfosForDefault(options.spec);
      break;
  }

  // sort commands by command string parts;
  // this will ensure any that should be grouped together are listed consecutively
  const sortedCommandInfos = _.sortBy(commandInfos, commandInfo => {
    return `${commandInfo.commandStringParts[0]} ${commandInfo
      .commandStringParts[1] || ''}`;
  });

  for (const info of sortedCommandInfos) {
    operationCommandBuilder(vorpal, options, info);

    spinner.render();
  }

  spinner.stop();
}

function getCommandInfosByPaths(spec) {
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

function getCommandInfosByTags(spec) {
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

function getCommandInfosForDefault(spec) {
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

module.exports = operationCommandsBuilder;

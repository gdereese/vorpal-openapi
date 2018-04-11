const vorpal = require('vorpal');

const setAuthApiKeyCommandBuilder = require('../src/set-auth-api-key-command-builder');

describe('set-auth-api-key-command-builder', () => {
  let vorpalInstance = null;

  afterEach(() => {
    vorpalInstance.ui.removeAllListeners();
  });

  it('adds command for each apiKey scheme', () => {
    vorpalInstance = vorpal();
    const options = {
      interactive: false,
      operations: {
        groupBy: null
      },
      spec: {
        securityDefinitions: {
          bar_auth: {
            name: 'bar',
            type: 'apiKey'
          },
          foo_auth: {
            name: 'foo',
            type: 'apiKey'
          }
        }
      }
    };

    const commands = setAuthApiKeyCommandBuilder(vorpalInstance, options);

    expect(commands[0]._name).toBe('set-auth bar-auth');
    expect(commands[1]._name).toBe('set-auth foo-auth');
  });
});

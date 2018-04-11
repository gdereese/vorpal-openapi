const vorpal = require('vorpal');

const setAuthStringCommandBuilder = require('../src/set-auth-string-command-builder');

describe('set-auth-string-command-builder', () => {
  let vorpalInstance = null;

  it('adds command for specified scheme', () => {
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
            type: 'basic'
          }
        }
      }
    };

    const commands = setAuthStringCommandBuilder(
      vorpalInstance,
      options,
      'apiKey'
    );

    expect(commands.length).toBe(1);
    expect(commands[0]._name).toBe('set-auth bar-auth');
  });

  afterEach(() => {
    vorpalInstance.ui.removeAllListeners();
  });
});

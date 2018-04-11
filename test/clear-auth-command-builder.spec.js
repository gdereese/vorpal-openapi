const vorpal = require('vorpal');

const clearAuthCommandBuilder = require('../src/clear-auth-command-builder');

describe('clear-auth-command-builder', () => {
  let vorpalInstance = null;

  afterEach(() => {
    vorpalInstance.ui.removeAllListeners();
  });

  it('adds command for each scheme', () => {
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
            type: 'basic'
          },
          foo_auth: {
            name: 'foo',
            type: 'apiKey'
          }
        }
      }
    };

    const commands = clearAuthCommandBuilder(vorpalInstance, options);

    expect(commands[0]._name).toBe('clear-auth bar-auth');
    expect(commands[1]._name).toBe('clear-auth foo-auth');
  });
});

const vorpal = require('vorpal');

const setAuthBasicCommandBuilder = require('../src/set-auth-basic-command-builder');

describe('set-auth-basic-command-builder', () => {
  let vorpalInstance = null;

  afterEach(() => {
    vorpalInstance.ui.removeAllListeners();
  });

  it('adds command for each basic scheme', () => {
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
            type: 'basic'
          }
        }
      }
    };

    const commands = setAuthBasicCommandBuilder(vorpalInstance, options);

    expect(commands[0]._name).toBe('set-auth bar-auth');
    expect(commands[1]._name).toBe('set-auth foo-auth');
  });
});

import * as localStorageKeys from './local-storage-keys';

export class SetAuthStringAction {
  constructor(private command) {}

  public run(args, schemeKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.command.log();

      // try to get auth object from local storage (initialize if missing or invalid)
      const authJson = this.command.parent.localStorage.getItem(
        localStorageKeys.AUTH
      );
      let auth = null;
      try {
        auth = authJson ? JSON.parse(authJson) : {};
      } catch {
        auth = {};
      }

      auth[schemeKey] = args.value;

      this.command.parent.localStorage.setItem(
        localStorageKeys.AUTH,
        JSON.stringify(auth)
      );
      this.command.log('Authentication set');

      this.command.log();

      resolve();
    });
  }
}

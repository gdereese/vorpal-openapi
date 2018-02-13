import { Options } from './options';

export interface IVorpalBuilder {
  build(vorpal, options: Options);
}

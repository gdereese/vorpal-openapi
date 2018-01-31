import axios from 'axios';
import * as vorpalImport from 'vorpal';

import { Options } from './options';
import * as vorpalBuilder from './vorpal-builder';

export default function VorpalSwaggerExtension(vorpal, options: Options) {
  vorpalBuilder.build(vorpal, options);
}

axios.get('http://petstore.swagger.io/v2/swagger.json').then(response => {
  const vorpalSwaggerOptions: Options = {
    operations: {
      groupBy: 'tag'
    },
    spec: response.data
  };

  vorpalImport()
    .use(VorpalSwaggerExtension, vorpalSwaggerOptions)
    .show()
    .parse(process.argv);
});

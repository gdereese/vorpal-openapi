import axios from 'axios';
import * as vorpalImport from 'vorpal';

import * as VorpalSwaggerExtension from './extension';
import { Options } from './options';

export default VorpalSwaggerExtension.use;

axios.get('http://petstore.swagger.io/v2/swagger.json').then(response => {
  const vorpalSwaggerOptions: Options = {
    operations: {
      groupBy: 'tag'
    },
    spec: response.data
  };

  vorpalImport()
    .use(VorpalSwaggerExtension.use, vorpalSwaggerOptions)
    .show()
    .parse(process.argv);
});

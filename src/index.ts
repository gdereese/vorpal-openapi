import axios from 'axios';
import * as vorpalImport from 'vorpal';

import * as VorpalOpenApiExtension from './extension';
import { Options } from './options';

export default VorpalOpenApiExtension.use;

axios.get('http://petstore.swagger.io/v2/swagger.json').then(response => {
  const vorpalOpenApiOptions: Options = {
    operations: {
      groupBy: 'tag'
    },
    spec: response.data
  };

  vorpalImport()
    .use(VorpalOpenApiExtension.use, vorpalOpenApiOptions)
    .show()
    .parse(process.argv);
});

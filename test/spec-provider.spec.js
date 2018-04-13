const specProvider = require('../src/spec-provider');

describe('spec-provider', () => {
  it('returns spec from local path', () => {
    const path = './test/fixtures/petstore_swagger.json';

    specProvider(path)
      .then(spec => {
        expect(spec).toBeTruthy();
      })
      .catch(error => {
        fail(error);
      });
  });

  it('returns spec from url', () => {
    const url = 'http://petstore.swagger.io/v2/swagger.json';

    specProvider(url)
      .then(spec => {
        expect(spec).toBeTruthy();
      })
      .catch(error => {
        fail(error);
      });
  });

  it('throws error if error encountered reading local file', () => {
    const path = './xxx';

    specProvider(path)
      .then(() => {
        fail('expected error to be thrown');
      })
      .catch(error => {
        expect(error).toBeTruthy();
      });
  });

  it('throws error if error encountered requesting url', () => {
    const url = 'http://xxx';

    specProvider(url)
      .then(() => {
        fail('expected error to be thrown');
      })
      .catch(error => {
        expect(error).toBeTruthy();
      });
  });

  it('throws error if path is falsy', () => {
    const url = undefined;

    specProvider(url)
      .then(() => {
        fail('expected error to be thrown');
      })
      .catch(error => {
        expect(error).toBeTruthy();
      });
  });

  it('throws error is spec is not valid', () => {
    const path = './test/fixtures/petstore_swagger_invalid.json';

    specProvider(path)
      .then(() => {
        fail('expected error to be thrown');
      })
      .catch(error => {
        expect(error).toBeTruthy();
      });
  });
});

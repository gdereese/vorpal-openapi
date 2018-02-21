import { SpecProvider } from '../src/spec-provider';

describe('spec-provider', () => {
  it('returns spec from local path', () => {
    const path = './test/fixtures/petstore_swagger.json';

    const provider = new SpecProvider();

    provider
      .getSpec(path)
      .then(spec => {
        expect(spec).toBeTruthy();
      })
      .catch(errorMessage => {
        fail(errorMessage);
      });
  });

  it('returns spec from url', () => {
    const url = 'http://petstore.swagger.io/v2/swagger.json';

    const provider = new SpecProvider();

    provider
      .getSpec(url)
      .then(spec => {
        expect(spec).toBeTruthy();
      })
      .catch(errorMessage => {
        fail(errorMessage);
      });
  });

  it('throws error if error encountered reading local file', () => {
    const path = './xxx';

    const provider = new SpecProvider();

    provider
      .getSpec(path)
      .then(spec => {
        fail('expected error to be thrown');
      })
      .catch(errorMessage => {
        expect(errorMessage).toBeTruthy();
      });
  });

  it('throws error if error encountered requesting url', () => {
    const url = 'http://xxx';

    const provider = new SpecProvider();

    provider
      .getSpec(url)
      .then(spec => {
        fail('expected error to be thrown');
      })
      .catch(errorMessage => {
        expect(errorMessage).toBeTruthy();
      });
  });

  it('throws error if path is falsy', () => {
    const url = undefined;

    const provider = new SpecProvider();

    provider
      .getSpec(url)
      .then(spec => {
        fail('expected error to be thrown');
      })
      .catch(errorMessage => {
        expect(errorMessage).toBeTruthy();
      });
  });
});

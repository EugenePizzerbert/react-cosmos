// @flow

import { uuid } from 'react-cosmos-shared2/util';
import { runTests, mount } from '../testHelpers';

const rendererId = uuid();
const fixtures = { first: null, second: null };
const decorators = {};

runTests(mockConnect => {
  it('renders blank state message', async () => {
    await mockConnect(async ({ getElement }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          expect(renderer.toJSON()).toEqual('No fixture loaded.');
        }
      );
    });
  });

  it('posts ready response on mount', async () => {
    await mockConnect(async ({ getElement, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async () => {
          await untilMessage({
            type: 'rendererReady',
            payload: {
              rendererId,
              fixtures: { first: null, second: null }
            }
          });
        }
      );
    });
  });

  it('posts ready response again on ping request', async () => {
    await mockConnect(async ({ getElement, untilMessage, postMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async () => {
          await untilMessage({
            type: 'rendererReady',
            payload: {
              rendererId,
              fixtures: { first: null, second: null }
            }
          });

          await postMessage({
            type: 'pingRenderers'
          });

          await untilMessage({
            type: 'rendererReady',
            payload: {
              rendererId,
              fixtures: { first: null, second: null }
            }
          });
        }
      );
    });
  });

  it('posts fixture list on "fixtures" prop change', async () => {
    await mockConnect(async ({ getElement, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          await untilMessage({
            type: 'rendererReady',
            payload: {
              rendererId,
              fixtures: { first: null, second: null }
            }
          });

          renderer.update(
            getElement({
              rendererId,
              fixtures: {
                ...fixtures,
                third: null
              },
              decorators
            })
          );

          await untilMessage({
            type: 'fixtureListUpdate',
            payload: {
              rendererId,
              fixtures: { first: null, second: null, third: null }
            }
          });
        }
      );
    });
  });
});

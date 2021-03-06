import { copy } from 'ember-copy';

export default () =>
  copy(
    [
      {
        id: '12345',
        name: 'main',
        pipelineId: '4',
        state: 'ENABLED',
        archived: false
      },
      {
        id: '12346',
        name: 'publish',
        pipelineId: '4',
        state: 'ENABLED',
        archived: false
      },
      {
        id: '12347',
        name: 'PR-42:main',
        pipelineId: '4',
        state: 'ENABLED',
        archived: false
      },
      {
        id: '12348',
        name: 'PR-42:publish',
        pipelineId: '4',
        state: 'ENABLED',
        archived: false
      },
      {
        id: '12349',
        name: 'PR-43:main',
        pipelineId: '4',
        state: 'ENABLED',
        archived: false
      }
    ],
    true
  );

/**
 * Return jobs mock for use with metrics
 *
 * @export
 * @returns
 */
export function metricJobs() {
  return copy(
    [
      {
        id: 159,
        name: 'prod',
        pipelineId: 4,
        state: 'ENABLED',
        archived: false
      },
      {
        id: 158,
        name: 'beta',
        pipelineId: 4,
        state: 'ENABLED',
        archived: false
      },
      {
        id: 157,
        name: 'publish',
        pipelineId: 4,
        state: 'ENABLED',
        archived: false
      },
      {
        id: 156,
        name: 'main',
        pipelineId: 4,
        state: 'ENABLED',
        archived: false
      }
    ],
    true
  );
}

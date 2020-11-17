import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { and } from '@ember/object/computed';
import { formatMetrics } from 'screwdriver-ui/utils/metric';

export default Component.extend({
  store: service(),
  eventsInfo: null,
  lastEventInfo: null,
  isAuthenticated: undefined,
  isOrganizing: false,
  pipeline: null,
  pipelineSelected: false,
  classNames: ['pipeline-card'],
  reset: false,

  showCheckbox: and('isOrganizing', 'isAuthenticated'),

  showRemoveButton: computed('isOrganizing', 'isAuthenticated', function showRemoveButton() {
    return !this.isOrganizing && this.isAuthenticated;
  }),

  async init() {
    this._super(...arguments);
    const { pipeline } = this;
    const metrics = await this.store.query('metric', {
      pipelineId: pipeline.id,
      page: 1,
      count: 20
    });

    const result = formatMetrics(metrics);

    let eventsInfos = result.eventsInfo;

    let lastEventInfos = result.lastEventInfo;

    this.setProperties({
      eventsInfo: eventsInfos,
      lastEventInfo: lastEventInfos
    });
  },

  actions: {
    removePipeline() {
      this.removePipeline(this.pipeline.id);
    },
    togglePipeline() {
      const pipelineId = this.pipeline.id;

      if (this.reset) {
        this.setProperties({
          pipelineSelected: false,
          reset: false
        });
      }

      if (this.pipelineSelected) {
        this.set('pipelineSelected', false);
        this.deselectPipeline(pipelineId);
      } else {
        this.set('pipelineSelected', true);
        this.selectPipeline(pipelineId);
      }
    }
  }
});

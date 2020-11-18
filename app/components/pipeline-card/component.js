import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { and } from '@ember/object/computed';
import { formatMetrics } from 'screwdriver-ui/utils/metric';

export default Component.extend({
  store: service(),
  inViewport: service(),
  eventsInfo: null,
  lastEventInfo: null,
  isAuthenticated: undefined,
  isOrganizing: false,
  pipeline: null,
  pipelineSelected: false,
  classNames: ['pipeline-card'],
  reset: false,

  updated: and('eventsInfo', 'lastEventInfo'),
  showCheckbox: and('isOrganizing', 'isAuthenticated'),

  showRemoveButton: computed('isOrganizing', 'isAuthenticated', function showRemoveButton() {
    return !this.isOrganizing && this.isAuthenticated;
  }),

  didRender() {
    if (!this.updated) {
      this.setupInViewport();
    }
  },
  setupInViewport() {
    const pipelineCardContent = this.element.querySelector('.pipeline-card-content');
    const { onEnter } = this.inViewport.watchElement(pipelineCardContent);

    onEnter(this.didEnterViewport.bind(this));
  },
  async didEnterViewport() {
    const pipelineCardContent = this.element.querySelector('.pipeline-card-content');

    this.inViewport.stopWatching(pipelineCardContent);
    this.updateEventMetrics();
  },
  async updateEventMetrics() {
    const metrics = await this.store.query('metric', {
      pipelineId: this.pipeline.id,
      page: 1,
      count: 20
    });

    const result = formatMetrics(metrics);
    const { eventsInfo, lastEventInfo } = result;

    this.setProperties({
      eventsInfo,
      lastEventInfo
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

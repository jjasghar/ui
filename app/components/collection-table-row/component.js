import Component from '@ember/component';
import { computed } from '@ember/object';
import { and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { formatMetrics } from 'screwdriver-ui/utils/metric';

export default Component.extend({
  store: service(),
  inViewport: service(),
  tagName: 'tr',
  eventsInfo: null,
  lastEventInfo: null,
  isAuthenticated: false,
  isOrganizing: false,
  pipeline: null,
  pipelineSelected: false,
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
    const chooseButton = this.element.querySelector('.collection-pipeline__choose');
    const { onEnter } = this.inViewport.watchElement(chooseButton);

    onEnter(this.didEnterViewport.bind(this));
  },
  async didEnterViewport() {
    const chooseButton = this.element.querySelector('.collection-pipeline__choose');

    this.inViewport.stopWatching(chooseButton);
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

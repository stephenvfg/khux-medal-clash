import { assign } from 'underscore';
import alt from '../alt';
import StatsActions from '../actions/stats_actions';

class StatsStore {
  constructor() {
    this.bindActions(StatsActions);
    this.totalCount = 0;
    this.uprightCount = 0;
    this.reversedCount = 0;
    this.powerCount = 0;
    this.speedCount = 0;
    this.magicCount = 0;
    this.totalVotes = 0;
    this.leadingAffinity = { affinity: '', count: 0 };
    this.leadingAttribute = { attribute: '', count: 0 };
  }

  onGetStatsSuccess(data) {
    assign(this, data);
  }

  onGetStatsFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(StatsStore);
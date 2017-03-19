import alt from '../alt';
import RoadmapActions from '../actions/roadmap_actions';

class RoadmapStore {
  constructor() {
    this.bindActions(RoadmapActions);
  }
}

export default alt.createStore(RoadmapStore);
import alt from '../alt';
import VotesGoalActions from '../actions/votes_goal_actions';

class VotesGoalStore {
  constructor() {
    this.bindActions(VotesGoalActions);

    this.count = 0;
  }

  onGetCountSuccess(data) {
    this.count = data.count;
  }

  onGetCountFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(VotesGoalStore);
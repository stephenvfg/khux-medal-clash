import alt from '../alt';
import MedalCompeteActions from '../actions/medal_compete_actions';

class MedalCompeteStore {
  constructor() {
    this.bindActions(MedalCompeteActions);
    this.medals = [];
    this.showCards = false;
  }

  onGetTwoMedalsSuccess(data) {
    this.medals = data;
  }

  onGetTwoMedalsFail(errorMessage) {
    toastr.error(errorMessage);
  }

  onVoteFail(errorMessage) {
    toastr.error(errorMessage);
  }
}

export default alt.createStore(MedalCompeteStore);
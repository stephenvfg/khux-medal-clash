import { assign, contains } from 'underscore';
import alt from '../alt';
import MedalActions from '../actions/medal_actions';

class MedalStore {
  constructor() {
    this.bindActions(MedalActions);

    this.medal = '';

    this.winLossRatio = 0;
  }

  onGetMedalSuccess(data) {
    this.medal = data;
    $(document.body).attr('class', 'profile-' + this.medal.affinity + '-' + this.medal.attribute);
    // If is NaN (from division by zero) then set it to "0"
    this.winLossRatio = ((this.medal.wins / (this.medal.wins + this.medal.losses) * 100) || 0).toFixed(1);
  }

  onGetMedalFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(MedalStore);
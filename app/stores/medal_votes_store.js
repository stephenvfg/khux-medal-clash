import alt from '../alt';
import MedalVotesActions from '../actions/medal_votes_actions';

class MedalVotesStore {

  constructor() {
    this.bindActions(MedalVotesActions);
    this.votes = [];
    this.vMedals = {};
  }

  onGetMedalVotesSuccess(data) {
    this.votes = data;

    this.votes.map((vote, index) => {
      MedalVotesActions.getMedalsByVote(vote._id, index);
    });
  }

  onGetMedalVotesFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onGetMedalsByVoteSuccess(data) {
    this.vMedals[data.idx] = data.medals;
  }

  onGetMedalsByVoteFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(MedalVotesStore);
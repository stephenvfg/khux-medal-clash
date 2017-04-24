import alt from '../alt';
import UserVotesActions from '../actions/user_votes_actions';

class UserVotesStore {
  constructor() {
    this.bindActions(UserVotesActions);

    this.totalVotes = 0;
    this.votes = [];
    this.vMedals = {};
    this.i = 0;

    this.user = '';
  }

  onLoggedInSuccess(user) {
    this.user = user;
  }

  onLoggedInFail() { /* do nothing */ }

  onGetVotesSuccess(data) {
    if (!data.message) {
      this.votes = data;

      this.votes.map((vote, index) => {
        UserVotesActions.getMedalsByVote(vote._id, index);
      });
    }
  }

  onGetVotesFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onGetMedalsByVoteSuccess(data) {
    this.vMedals[data.idx] = data.medals;
  }

  onGetMedalsByVoteFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onUpdateIndex(i) {
    this.i = i;
    UserVotesActions.getVotes(this.i);
  }

  onGetVoteCountSuccess(data) {
    this.totalVotes = data.count;
  }

  onGetVoteCountFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onUpdateVoteSuccess(message) {
    toastr.success(message);
  }

  onUpdateVoteFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(UserVotesStore);
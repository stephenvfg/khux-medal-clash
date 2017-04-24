import alt from '../alt';
import MedalCompeteActions from '../actions/medal_compete_actions';

class MedalCompeteStore {
  constructor() {
    this.bindActions(MedalCompeteActions);

    this.user = '';
    
    this.medals = [];
    this.showCards = false;
    this.showedCardsOnce = false;

    // hack-y solution to track user votes
    this.currentVotes = 0;
    this.showNotePanel = (this.currentVotes > 13 && this.user == undefined);

    // hack-y solution to force votes bar to reload
    this.votesKey = Math.random();
  }

  onLoggedInSuccess(user) {
    this.user = user;
  }

  onLoggedInFail() { /* do nothing */ }

  onGetTwoMedalsSuccess(data) {
    this.medals = data;

    // hack-y solution to track user votes
    if (this.currentVotes == 12) {
      MedalCompeteActions.loggedIn();
    }
    if (this.currentVotes == 13 && this.user == undefined) {
      this.showNotePanel = true;
    }
    this.currentVotes++;

    // hack-y solution to force votes bar to reload
    this.votesKey = Math.random();
  }

  onGetTwoMedalsFail(errorMessage) {
    toastr.error(errorMessage);
  }

  onVoteFail(errorMessage) {
    toastr.error(errorMessage);
  }
}

export default alt.createStore(MedalCompeteStore);
import alt from '../alt';
import UserContributorActions from '../actions/user_contributor_actions';

class UserContributorStore {
  constructor() {
    this.bindActions(UserContributorActions);
    this.medals = [];

    this.user = '';
  }

  onLoggedInSuccess(user) {
    this.user = user;
    if (user) {
      UserContributorActions.getMedals(user._id);
    }
  }

  onLoggedInFail() { /* do nothing */ }

  onGetMedalsSuccess(data) {
    this.medals = data;
  }

  onGetMedalsFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onActivateMedalSuccess(message) {
    toastr.success(message);
  }

  onActivateMedalFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(UserContributorStore);
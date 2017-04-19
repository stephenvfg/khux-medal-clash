import alt from '../alt';
import UserAdminActions from '../actions/user_admin_actions';

class UserAdminStore {
  constructor() {
    this.bindActions(UserAdminActions);

    this.totalUsers = 0;
    this.users = [];
    this.i = 0;

    this.user = '';
  }

  onLoggedInSuccess(user) {
    this.user = user;
  }

  onLoggedInFail() { /* do nothing */ }

  onGetUsersSuccess(data) {
    if (!data.message) {
      this.users = data;
    }
  }

  onGetUsersFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onUpdateIndex(i) {
    this.i = i;
    UserAdminActions.getUsers(this.i);
  }

  onGetUserCountSuccess(data) {
    this.totalUsers = data.count;
  }

  onGetUserCountFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onUpdateContributorSuccess(message) {
    toastr.success(message);
  }

  onUpdateContributorFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onUpdateAdminSuccess(message) {
    toastr.success(message);
  }

  onUpdateAdminFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(UserAdminStore);
import alt from '../alt';

class UserAdminActions {
  constructor() {
    this.generateActions(
      'loggedInSuccess',
      'loggedInFail',
      'getUsersSuccess',
      'getUsersFail',
      'getUserCountSuccess',
      'getUserCountFail',
      'updateStart'
    );
  }

  loggedIn() {
    $.ajax({ url: '/api/login' })
      .done((data) => {
        this.actions.loggedInSuccess(data.user);
      })
      .fail((jqXhr) => {
        this.actions.loggedInFail();
      });
  }

  getUsers(start) {

    var urlParam = start ? '?start='+start : '';

    $.ajax({ url: '/api/users' + urlParam })
      .done((data) => {
        this.actions.getUsersSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getUsersFail(jqXhr);
      });
  }

  getUserCount() {
    $.ajax({ url: '/api/users/count' })
      .done((data) => {
        this.actions.getUserCountSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getUserCountFail(jqXhr)
      });
  }
}

export default alt.createActions(UserAdminActions);
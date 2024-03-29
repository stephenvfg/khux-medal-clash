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
      'updateContributorSuccess',
      'updateContributorFail',
      'updateAdminSuccess',
      'updateAdminFail',
      'updateIndex'
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

  updateContributor(id, contributor) {
    $.ajax({
      type: 'PUT',
      url: '/api/user/admin',
      data: { 
        id: id,
        contributor: contributor 
      }
    })
      .done((data) => {
        this.actions.updateContributorSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.updateContributorFail(jqXhr);
      });
  }

  updateAdmin(id, admin) {
    $.ajax({
      type: 'PUT',
      url: '/api/user/admin',
      data: { 
        id: id,
        admin: admin 
      }
    })
      .done((data) => {
        this.actions.updateAdminSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.updateAdminFail(jqXhr);
      });
  }
}

export default alt.createActions(UserAdminActions);
import alt from '../alt';

class UserActions {
  constructor() {
    this.generateActions(
      'loggedInSuccess',
      'loggedInFail',
      'updateSuccess',
      'updateFail',
      'updateUsername',
      'updateEmail',
      'updateOldPassword',
      'updatePassword',
      'updatePassword2',
      'invalidUsername',
      'invalidEmail',
      'invalidOldPassword',
      'invalidPassword',
      'invalidPassword2'
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

  update(id, username, oldPassword, password, email) {
    $.ajax({
      type: 'PUT',
      url: '/api/user/',
      data: { 
        id: id,
        username: username,
        oldPassword: oldPassword,
        password: password,
        email: email
      }
    })
      .done((data) => {
        this.actions.updateSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.updateFail(jqXhr);
      });
  }
}

export default alt.createActions(UserActions);
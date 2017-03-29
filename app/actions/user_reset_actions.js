import alt from '../alt';

class UserResetActions {
  constructor() {
    this.generateActions(
      'getResetSuccess',
      'getResetFail',
      'resetSuccess',
      'resetFail',
      'updatePassword',
      'updatePassword2',
      'invalidPassword',
      'invalidPassword2'
    );
  }

  getReset(token) {
    $.ajax({ url: '/api/reset/' + token })
      .done((data) => {
        this.actions.getResetSuccess(data.user);
      })
      .fail((jqXhr) => {
        this.actions.getResetFail(jqXhr);
      });
  }

  reset(token, password) {
    $.ajax({
      type: 'POST',
      url: '/api/reset/' + token,
      data: { 
        password: password
      }
    })
      .done((data) => {
        this.actions.resetSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.resetFail(jqXhr);
      });
  }
}

export default alt.createActions(UserResetActions);
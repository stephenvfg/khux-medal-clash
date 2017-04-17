import alt from '../alt';

class UserContributorActions {

  constructor() {
    this.generateActions(
      'loggedInSuccess',
      'loggedInFail',
      'getMedalsSuccess',
      'getMedalsFail'
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

  getMedals(id) {
    let url = '/api/medals/user/' + id;

    $.ajax({ url: url })
      .done((data) => {
        this.actions.getMedalsSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getMedalsFail(jqXhr);
      }
    );
  }
}

export default alt.createActions(UserContributorActions);
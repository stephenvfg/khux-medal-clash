import alt from '../alt';

class MedalCompeteActions {
  constructor() {
    this.generateActions(
      'loggedInSuccess',
      'loggedInFail',
      'getTwoMedalsSuccess',
      'getTwoMedalsFail',
      'voteFail'
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

  getTwoMedals() {
    $.ajax({ url: '/api/medals' })
      .done(data => {
        this.actions.getTwoMedalsSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.getTwoMedalsFail(jqXhr.responseJSON.message);
      });
  }

  vote(winner, loser, voter) {
    $.ajax({
      type: 'PUT',
      url: '/api/medals' ,
      data: { winner: winner, loser: loser, voter: voter }
    })
      .done(() => {
        this.actions.getTwoMedals();
        mixpanel.track("User voted");
      })
      .fail((jqXhr) => {
        this.actions.voteFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(MedalCompeteActions);
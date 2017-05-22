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

    let r = Math.random();
    var pathAppend = '';

    // 10% of the time, use the /featured path
    // 40% of the time, use the /newest path
    if (r < 0.1) { pathAppend = '/featured'; }
    else if (r < 0.5) { pathAppend = '/newest'; }

    $.ajax({ url: '/api/medals' + pathAppend })
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
      data: { winner: winner, loser: loser, voter: voter, legit: true }
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
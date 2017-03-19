import alt from '../alt';

class MedalCompeteActions {
  constructor() {
    this.generateActions(
      'getTwoMedalsSuccess',
      'getTwoMedalsFail',
      'voteFail'
    );
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

  vote(winner, loser) {
    $.ajax({
      type: 'PUT',
      url: '/api/medals' ,
      data: { winner: winner, loser: loser }
    })
      .done(() => {
        this.actions.getTwoMedals();
      })
      .fail((jqXhr) => {
        this.actions.voteFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(MedalCompeteActions);
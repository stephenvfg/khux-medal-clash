import alt from '../alt';

class VotesGoalActions {
  constructor() {
    this.generateActions(
      'getCountSuccess',
      'getCountFail'
    );
  }

  getCount() {
    $.ajax({ url: '/api/votes/count' })
      .done((data) => {
        this.actions.getCountSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getCountFail(jqXhr);
      });
  }
}

export default alt.createActions(VotesGoalActions);
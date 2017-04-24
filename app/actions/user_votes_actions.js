import alt from '../alt';

class UserVotesActions {
  constructor() {
    this.generateActions(
      'loggedInSuccess',
      'loggedInFail',
      'getVotesSuccess',
      'getVotesFail',
      'getMedalsByVoteSuccess',
      'getMedalsByVoteFail',
      'getVoteCountSuccess',
      'getVoteCountFail',
      'updateVoteSuccess',
      'updateVoteFail',
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

  getVotes(start) {

    var urlParam = start ? '?start='+start : '';

    $.ajax({ url: '/api/user/votes' + urlParam })
      .done((data) => {
        this.actions.getVotesSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getVotesFail(jqXhr);
      });
  }

  getMedalsByVote(_id, voteListIdx) {
    $.ajax({ url: '/api/medals/vote/' + _id  })
      .done((data) => {
        var voteMedals = { medals: data, idx: voteListIdx };
        this.actions.getMedalsByVoteSuccess(voteMedals);
      })
      .fail((jqXhr) => {
        this.actions.getMedalsByVoteFail(jqXhr);
      }
    );
  }

  getVoteCount() {
    $.ajax({ url: '/api/user/votes/count' })
      .done((data) => {
        this.actions.getVoteCountSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getVoteCountFail(jqXhr)
      });
  }

  updateVote(id, winner, loser, active) {
    $.ajax({
      type: 'PUT',
      url: '/api/user/votes',
      data: { 
        id: id,
        winner: winner,
        loser: loser,
        active: active
      }
    })
      .done((data) => {
        this.actions.updateVoteSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.updateVoteFail(jqXhr);
      });
  }
}

export default alt.createActions(UserVotesActions);
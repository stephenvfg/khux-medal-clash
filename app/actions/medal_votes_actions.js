import alt from '../alt';

class MedalVotesActions {

  constructor() {
    this.generateActions(
      'getMedalVotesSuccess',
      'getMedalVotesFail',
      'getMedalsByVoteSuccess',
      'getMedalsByVoteFail'
    );
  }

  getMedalVotes(_id) {
    $.ajax({ url: '/api/medals/' + _id + '/votes' })
      .done((data) => {
        this.actions.getMedalVotesSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getMedalVotesFail(jqXhr);
      }
    );
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
}

export default alt.createActions(MedalVotesActions);
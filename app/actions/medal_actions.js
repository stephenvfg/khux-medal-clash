import alt from '../alt';

class MedalActions {
  constructor() {
    this.generateActions(
      'getMedalSuccess',
      'getMedalFail'
    );
  }

  getMedal(slug) {
    $.ajax({ url: '/api/medals/slug/' + slug })
      .done((data) => {
        this.actions.getMedalSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getMedalFail(jqXhr);
      });
  }
}

export default alt.createActions(MedalActions);
import alt from '../alt';

class MedalListActions {

  constructor() {
    this.generateActions(
      'getMedalsSuccess',
      'getMedalsFail'
    );
  }

  getMedals(payload) {
    let url = '/api/medals/top';
    let params = {
      affinity: payload.affinity,
      attribute: payload.attribute
    };

    if (payload.category === 'shame') {
      url = '/api/medals/shame';
    }

    $.ajax({ url: url, data: params })
      .done((data) => {
        this.actions.getMedalsSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getMedalsFail(jqXhr);
      }
    );
  }
}

export default alt.createActions(MedalListActions);
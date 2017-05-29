import alt from '../alt';

class MedalListActions {

  constructor() {
    this.generateActions(
      'getMedalsSuccess',
      'getMedalsFail'
    );
  }

  getMedals(params, query) {
    let url = '/api/medals/top';

    if (params.category === 'shame') {
      url = '/api/medals/shame';
    }

    let filters = {
      affinity: query.af || params.affinity,
      attribute: query.at || params.attribute,
      target: query.sat,
      tier: query.t,
      isGuilted: query.g
    };

    $.ajax({ url: url, data: filters })
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
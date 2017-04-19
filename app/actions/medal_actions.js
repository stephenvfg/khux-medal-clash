import alt from '../alt';

class MedalActions {
  constructor() {
    this.generateActions(
      'getMedalSuccess',
      'getMedalFail',
      'getVariantsSuccess',
      'getVariantsFail'
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

  getVariants(no) {
    $.ajax({ url: '/api/medals/no/' + no })
      .done((data) => {
        this.actions.getVariantsSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getVariantsFail(jqXhr);
      });
  }
}

export default alt.createActions(MedalActions);
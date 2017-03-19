import alt from '../alt';

class FooterActions {
  constructor() {
    this.generateActions(
      'getTopMedalsSuccess',
      'getTopMedalsFail'
    );
  }

  getTopMedals() {
    $.ajax({ url: '/api/medals/top' })
      .done((data) => {
        this.actions.getTopMedalsSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getTopMedalsFail(jqXhr)
      });
  }
}

export default alt.createActions(FooterActions);
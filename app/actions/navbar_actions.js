import alt from '../alt';
import { assign } from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getMedalCountSuccess',
      'getMedalCountFail',
      'findMedalSuccess',
      'findMedalFail'
    );
  }

  findMedal(payload) {
    $.ajax({
      url: '/api/medals/search',
      data: { name: payload.searchQuery }
    })
      .done((data) => {
        assign(payload, data);
        this.actions.findMedalSuccess(payload);
      })
      .fail(() => {
        this.actions.findMedalFail(payload);
      });
  }

  getMedalCount() {
    $.ajax({ url: '/api/medals/count' })
      .done((data) => {
        this.actions.getMedalCountSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getMedalCountFail(jqXhr)
      });
  }
}

export default alt.createActions(NavbarActions);
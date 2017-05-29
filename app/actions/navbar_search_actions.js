import alt from '../alt';
import { assign } from 'underscore';

class NavbarSearchActions {
  constructor() {
    this.generateActions(
      'updateSearchQuery',
      'findMedalsSuccess',
      'findMedalsFail'
    );
  }

  findMedals(searchQuery) {
    $.ajax({
      url: '/api/medals/search/results',
      data: { name: searchQuery }
    })
      .done((data) => {
        this.actions.findMedalsSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.findMedalsFail(jqXhr);
      });
  }
}

export default alt.createActions(NavbarSearchActions);
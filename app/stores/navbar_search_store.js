import alt from '../alt';
import NavbarSearchActions from '../actions/navbar_search_actions';

class NavbarSearchStore {
  constructor() {
    this.bindActions(NavbarSearchActions);
    this.searchResults = [];
  }

  onFindMedalsSuccess(data) {
    this.searchResults = data;
  }

  onFindMedalsFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onUpdateSearchQuery(event) {
    this.searchQuery = event.target.value;
  }
}

export default alt.createStore(NavbarSearchStore);
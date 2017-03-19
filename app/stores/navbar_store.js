import alt from '../alt';
import NavbarActions from '../actions/navbar_actions';

class NavbarStore {
  constructor() {
    this.bindActions(NavbarActions);
    this.totalMedals = 0;
    this.searchQuery = '';
    this.ajaxAnimationClass = '';
  }

  onFindMedalSuccess(payload) {
    payload.history.pushState(null, '/medals/' + payload.slug);
  }

  onFindMedalFail(payload) {
    payload.searchForm.classList.add('shake');
    setTimeout(() => {
      payload.searchForm.classList.remove('shake');
    }, 1000);
  }

  onUpdateAjaxAnimation(className) {
    this.ajaxAnimationClass = className;
  }

  onUpdateSearchQuery(event) {
    this.searchQuery = event.target.value;
  }

  onGetMedalCountSuccess(data) {
    this.totalMedals = data.count;
  }

  onGetMedalCountFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(NavbarStore);
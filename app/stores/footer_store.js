import alt from '../alt';
import FooterActions from '../actions/footer_actions';

class FooterStore {
  constructor() {
    this.bindActions(FooterActions);
    this.medals = [];
  }

  onGetTopMedalsSuccess(data) {
    this.medals = data.slice(0, 10);
  }

  onGetTopMedalsFail(jqXhr) {
    // Handle multiple response formats, fallback to HTTP status code number.
    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
  }
}

export default alt.createStore(FooterStore);
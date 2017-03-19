import alt from '../alt';
import MedalListActions from '../actions/medal_list_actions';

class MedalListStore {
  constructor() {
    this.bindActions(MedalListActions);
    this.medals = [];
  }

  onGetMedalsSuccess(data) {
    this.medals = data;
  }

  onGetMedalsFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(MedalListStore);
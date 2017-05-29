import alt from '../alt';
import NewsAddActions from '../actions/news_add_actions';

class NewsAddStore {
  constructor() {
    this.bindActions(NewsAddActions);

    this.user = '';

    this.headline = '';
    this.content = '';
    this.type = '';
    this.headlineValidationState = '';
    this.contentValidationState = '';
    this.typeValidationState = '';
  }

  onLoggedInSuccess(user) {
    this.user = user;
  }

  onLoggedInFail() { /* do nothing */ }

  onNewsAddSuccess(successMessage) {
    toastr.success(successMessage);
  }

  onNewsAddFail(errorMessage) {
    toastr.error(errorMessage);
  }

  onUpdateHeadline(event) { 
    this.headline = event.target.value;
    this.headlineValidationState = '';
  }

  onUpdateContent(event) { 
    this.content = event.target.value;
    this.contentValidationState = '';
  }

  onUpdateType(event) { 
    this.type = event.target.value;
    this.typeValidationState = '';
  }

  onInvalidHeadline(event) { this.headlineValidationState = 'has-error'; }
  onInvalidContent(event) { this.contentValidationState = 'has-error'; }
  onInvalidType(event) { this.typeValidationState = 'has-error'; }

}

export default alt.createStore(NewsAddStore);
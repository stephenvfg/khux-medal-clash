import alt from '../alt';
import NavbarActions from '../actions/navbar_actions';

class NavbarStore {
  constructor() {
    this.bindActions(NavbarActions);
    this.totalMedals = 0;
    this.searchQuery = '';
    this.ajaxAnimationClass = '';

    this.username = '';
    this.password = '';
    this.password2 = '';
    this.email = '';

    this.user = '';
  }

  onLoginSuccess(user) {
    this.user = user;
    window.location.reload(false); 
  }

  onLoginFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onLoggedInSuccess(user) {
    this.user = user;
  }

  onLoggedInFail() { /* do nothing */ }

  onSignupSuccess(user) {
    this.user = user;
    window.location.reload(false); 
  }

  onSignupFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message); 
  }

  onSignoutSuccess() {
    this.user = '';
    window.location.reload(false); 
  }

  onSignoutFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message); 
  }

  onForgotSuccess(message) {
    toastr.success(message); 
  }

  onForgotFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message); 
  }

  onUpdateUsername(event) {
    this.username = event.target.value;
  }

  onUpdatePassword(event) {
    this.password = event.target.value;
  }

  onUpdatePassword2(event) {
    this.password2 = event.target.value;
  }

  onUpdateEmail(event) {
    this.email = event.target.value;
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
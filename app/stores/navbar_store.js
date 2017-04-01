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
    this.usernameValidationState = '';
    this.passwordValidationState = '';
    this.password2ValidationState = '';
    this.emailValidationState = '';

    this.formState = 0;

    this.user = '';
  }

  onLoginSuccess(user) {
    this.user = user;
  }

  onLoginFail(jqXhr) {
    toastr.error('Login failed.');
  }

  onLoggedInSuccess(user) {
    this.user = user;
  }

  onLoggedInFail() { /* do nothing */ }

  onSignupSuccess(user) {
    this.user = user;
  }

  onSignupFail(jqXhr) {
    toastr.error('Signup failed.'); 
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
    this.usernameValidationState = '';
  }

  onUpdatePassword(event) {
    this.password = event.target.value;
    this.passwordValidationState = '';
  }

  onUpdatePassword2(event) {
    this.password2 = event.target.value;
    this.password2ValidationState = '';
  }

  onUpdateEmail(event) {
    this.email = event.target.value;
    this.emailValidationState = '';
  }

  onInvalidUsername(event) { this.usernameValidationState = 'has-error'; }
  onInvalidPassword(event) { this.passwordValidationState = 'has-error'; }
  onInvalidPassword2(event) { this.password2ValidationState = 'has-error'; }
  onInvalidEmail(event) { this.emailValidationState = 'has-error'; }

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

  onCheckUsername() {
    NavbarActions.getValidUsername(this.username);
  }

  onCheckEmail() {
    NavbarActions.getValidEmail(this.email);
  }

  onGetValidUsernameSuccess(valid) {
    if (!valid) {
      this.usernameValidationState = 'has-error';
      toastr.error('Username is already taken.');
    }
  }

  onGetValidUsernameFail() {
    toastr.error('ERROR: Could not validate username.');
  }

  onGetValidEmailSuccess(valid) {
    if (!valid) {
      this.emailValidationState = 'has-error';
      toastr.error('Email is already taken.');
    }
  }

  onGetValidEmailFail() {
    toastr.error('ERROR: Could not validate email.');
  }

  onUpdateFormState(formState) {
    this.formState = formState;
  }
}

export default alt.createStore(NavbarStore);
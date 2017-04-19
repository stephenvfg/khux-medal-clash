import alt from '../alt';
import UserActions from '../actions/user_actions';

class UserStore {
  constructor() {
    this.bindActions(UserActions);

    this.initUsername = '';
    this.initEmail = '';

    this.username = '';
    this.oldPassword = '';
    this.password = '';
    this.password2 = '';
    this.email = '';

    this.usernameValidationState = '';
    this.oldPasswordValidationState = '';
    this.passwordValidationState = '';
    this.password2ValidationState = '';
    this.emailValidationState = '';

    this.user = '';
  }

  onLoggedInSuccess(user) {
    this.user = user;

    if (user) {
      this.initUsername = user.username;
      this.initEmail = user.email;

      this.username = user.username;
      this.email = user.email;
    }
  }

  onLoggedInFail() { /* do nothing */ }

  onUpdateSuccess(message) {
    toastr.success(message);

    this.initUsername = this.username;
    this.initEmail = this.email;
  }

  onUpdateFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onUpdateUsername(event) {
    this.username = event.target.value;
  }

  onUpdateOldPassword(event) {
    this.oldPassword = event.target.value;
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

  onInvalidUsername(event) { this.usernameValidationState = 'has-error'; }
  onInvalidOldPassword(event) { this.oldPasswordValidationState = 'has-error'; }
  onInvalidPassword(event) { this.passwordValidationState = 'has-error'; }
  onInvalidPassword2(event) { this.password2ValidationState = 'has-error'; }
  onInvalidEmail(event) { this.emailValidationState = 'has-error'; }

}

export default alt.createStore(UserStore);
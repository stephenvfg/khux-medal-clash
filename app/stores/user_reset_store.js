import alt from '../alt';
import UserResetActions from '../actions/user_reset_actions';

class UserResetStore {
  constructor() {
    this.bindActions(UserResetActions);

    this.password = '';
    this.password2 = '';

    this.passwordValidationState = '';
    this.password2ValidationState = '';

    this.successMessage = '';
    this.token = '';

    this.user = '';
  }

  onGetResetSuccess(user) {
    this.user = user;
  }

  onGetResetFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onResetSuccess(message) {
    this.successMessage = message;
  }

  onResetFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onUpdatePassword(event) {
    this.password = event.target.value;
  }

  onUpdatePassword2(event) {
    this.password2 = event.target.value;
  }

  onInvalidPassword(event) { this.passwordValidationState = 'has-error'; }
  onInvalidPassword2(event) { this.password2ValidationState = 'has-error'; }

}

export default alt.createStore(UserResetStore);
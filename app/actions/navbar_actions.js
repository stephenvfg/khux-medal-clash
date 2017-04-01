import alt from '../alt';
import { assign } from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'loginSuccess',
      'loginFail',
      'loggedInSuccess',
      'loggedInFail',
      'signupSuccess',
      'signupFail',
      'signoutSuccess',
      'signoutFail',
      'forgotSuccess',
      'forgotFail',
      'updateUsername',
      'updatePassword',
      'updatePassword2',
      'updateEmail',
      'invalidUsername',
      'invalidPassword',
      'invalidPassword2',
      'invalidEmail',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getMedalCountSuccess',
      'getMedalCountFail',
      'findMedalSuccess',
      'findMedalFail',
      'checkUsername',
      'checkEmail',
      'getValidUsernameSuccess',
      'getValidUsernameFail',
      'getValidEmailSuccess',
      'getValidEmailFail',
      'updateFormState'
    );
  }

  login(username, password) {
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: { 
        username: username,
        password: password
      }
    })
      .done((data) => {
        this.actions.loginSuccess(data.user);
      })
      .fail((jqXhr) => {
        this.actions.loginFail(jqXhr);
      });
  }

  loggedIn() {
    $.ajax({ url: '/api/login' })
      .done((data) => {
        this.actions.loggedInSuccess(data.user);
      })
      .fail((jqXhr) => {
        this.actions.loggedInFail();
      });
  }

  signup(username, password, email) {
    $.ajax({
      type: 'POST',
      url: '/api/signup',
      data: { 
        username: username,
        password: password,
        email: email
      }
    })
      .done((data) => {
        this.actions.signupSuccess(data.user);
      })
      .fail((jqXhr) => {
        this.actions.signupFail(jqXhr);
      }); 
  }

  signout() {
    $.ajax({ url: '/api/signout' })
      .done((data) => {
        this.actions.signoutSuccess();
      })
      .fail((jqXhr) => {
        this.actions.signoutFail(jqXhr);
      }); 
  }

  forgot(email) {
    $.ajax({
      type: 'POST',
      url: '/api/forgot',
      data: { 
        email: email
      }
    })
      .done((data) => {
        this.actions.forgotSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.forgotFail(jqXhr);
      }); 
  }

  findMedal(payload) {
    $.ajax({
      url: '/api/medals/search',
      data: { name: payload.searchQuery }
    })
      .done((data) => {
        assign(payload, data);
        this.actions.findMedalSuccess(payload);
      })
      .fail(() => {
        this.actions.findMedalFail(payload);
      });
  }

  getMedalCount() {
    $.ajax({ url: '/api/medals/count' })
      .done((data) => {
        this.actions.getMedalCountSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getMedalCountFail(jqXhr)
      });
  }

  getValidUsername(username) {
    $.ajax({ 
      url: '/api/signup/username',
      data: { username: username }
    })
      .done((data) => {
        this.actions.getValidUsernameSuccess(data.valid);
      })
      .fail((jqXhr) => {
        this.actions.getValidUsernameFail();
      });
  }

  getValidEmail(email) {
    $.ajax({ 
      url: '/api/signup/email',
      data: { email: email } 
    })
      .done((data) => {
        this.actions.getValidEmailSuccess(data.valid);
      })
      .fail((jqXhr) => {
        this.actions.getValidEmailFail();
      });
  }
}

export default alt.createActions(NavbarActions);
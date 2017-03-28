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
      'updateUsername',
      'updatePassword',
      'updatePassword2',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getMedalCountSuccess',
      'getMedalCountFail',
      'findMedalSuccess',
      'findMedalFail'
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

  signup(username, password) {
    $.ajax({
      type: 'POST',
      url: '/api/signup',
      data: { 
        username: username,
        password: password
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
}

export default alt.createActions(NavbarActions);
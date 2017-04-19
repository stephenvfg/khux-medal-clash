import React, { Component } from 'react';
import UserStore from '../stores/user_store';
import UserActions from '../actions/user_actions';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = UserStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    UserStore.listen(this.onChange);

    UserActions.loggedIn();
  }

  componentWillUnmount() {
    UserStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    var user = this.state.user;

    var username = this.state.username.trim();
    var oldPassword = this.state.oldPassword.trim();
    var password = this.state.password.trim();
    var password2 = this.state.password2.trim();
    var email = this.state.email.trim();

    var valid = true;

    var usernameChanged = true;
    var emailChanged = true;

    if (password && !oldPassword) {
      UserActions.invalidOldPassword();
      valid = false;
    }

    if (password && (password != password2)) {
      UserActions.invalidPassword2();
      valid = false;
    }

    if (username == this.state.initUsername) {
      username = undefined;
      usernameChanged = false;
    }

    if (email == this.state.initEmail) {
      email = undefined;
      emailChanged = false;
    }

    if (!(usernameChanged || emailChanged || password)) {
      toastr.error('Must update at least one field.');
    } else if (valid) {
      UserActions.update(user._id, username, oldPassword, password, email);
    } else {
      toastr.error('Fields not valid.');
    }
  }

  render() {

    return (
      <div className='container'>
        <div className='row flipInX animated'>
          <div className='col-sm-8'>
            { this.state.user 
              ? (
                <div className='panel panel-default'>
                  <div className='panel-heading'>Modify Profile Information</div>
                  <div className='panel-body'>
                    <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data">
                      <div className={'form-group ' + this.state.usernameValidationState}>
                        <label className='control-label'>Username</label>
                        <input type='text' className='form-control' ref='username' value={this.state.username}
                               onChange={UserActions.updateUsername} autoFocus/>
                      </div>
                      <div className={'form-group ' + this.state.oldPasswordValidationState}>
                        <label className='control-label'>Current Password</label>
                        <input type='password' className='form-control' ref='oldPassword' value={this.state.oldPassword}
                               onChange={UserActions.updateOldPassword} autoFocus/>
                      </div>
                      <div className={'form-group ' + this.state.passwordValidationState}>
                        <label className='control-label'>New Password</label>
                        <input type='password' className='form-control' ref='password' value={this.state.password}
                               onChange={UserActions.updatePassword} autoFocus/>
                      </div>
                      <div className={'form-group ' + this.state.password2ValidationState}>
                        <label className='control-label'>Confirm New Password</label>
                        <input type='password' className='form-control' ref='password2' value={this.state.password2}
                               onChange={UserActions.updatePassword2} autoFocus/>
                      </div>
                      <div className={'form-group ' + this.state.emailValidationState}>
                        <label className='control-label'>Email</label>
                        <input type='email' className='form-control' ref='username' value={this.state.email}
                               onChange={UserActions.updateEmail} autoFocus/>
                      </div>
                      <button type='submit' className='btn btn-primary'>Update Profile Information</button>
                    </form>
                  </div>
                </div>
              ) 
              : (
                <div className='panel panel-default'>
                  <div className='panel-heading'>Must be logged in to update profile information.</div>
                </div>
              ) 
            }
          </div>
        </div>
      </div>
    );
  }
}

export default User;
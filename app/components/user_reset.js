import React, { Component } from 'react';
import UserResetStore from '../stores/user_reset_store';
import UserResetActions from '../actions/user_reset_actions';

class UserReset extends Component {
  constructor(props) {
    super(props);
    this.state = UserResetStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    UserResetStore.listen(this.onChange);

    this.state.token = this.props.params.token;
    UserResetActions.getReset(this.state.token);
  }

  componentWillUnmount() {
    UserResetStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    var user = this.state.user;

    var password = this.state.password.trim();
    var password2 = this.state.password2.trim();

    var valid = true;

    if (!password) {
      UserResetActions.invalidPassword();
      this.refs.password.focus();
      valid = false;
    }

    if (!password2 || (password != password2)) {
      UserResetActions.invalidPassword2();
      valid = false;
    }

    if (valid) {
      UserResetActions.reset(this.props.params.token, password);
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
                  <div className='panel-heading'>Reset Password</div>
                  <div className='panel-body'>
                    <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data">
                      <div className={'form-group ' + this.state.passwordValidationState}>
                        <label className='control-label'>New Password</label>
                        <input type='password' className='form-control' ref='password' value={this.state.password}
                               onChange={UserResetActions.updatePassword} autoFocus/>
                      </div>
                      <div className={'form-group ' + this.state.password2ValidationState}>
                        <label className='control-label'>Confirm New Password</label>
                        <input type='password' className='form-control' ref='password2' value={this.state.password2}
                               onChange={UserResetActions.updatePassword2} autoFocus/>
                      </div>
                      <button type='submit' className='btn btn-primary'>Update Password</button>
                    </form>
                  </div>
                </div>
              ) 
              : (
                <div className='panel panel-default'>
                  <div className='panel-heading'>Password reset token is invalid or has expired.</div>
                </div>
              ) 
            }
          </div>
        </div>
      </div>
    );
  }
}

export default UserReset;
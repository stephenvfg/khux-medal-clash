import React, { Component } from 'react';
import { Link } from 'react-router';
import NavbarStore from '../stores/navbar_store';
import NavbarActions from '../actions/navbar_actions';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);

    NavbarActions.loggedIn();
    NavbarActions.getMedalCount();
  }

  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    let searchQuery = this.state.searchQuery.trim();

    if (searchQuery) {
      NavbarActions.findMedal({
        searchQuery: searchQuery,
        searchForm: this.refs.searchForm,
        history: this.props.history
      });
      mixpanel.track("Searched for a medal");
    }
  }

  handleLogin(event) {
    event.preventDefault();

    let username = this.state.username.trim();
    let password = this.state.password.trim();

    if (username && password) {
      NavbarActions.login(username, password);
    }
  }

  handleSignup(event) {
    event.preventDefault();

    let username = this.state.username.trim();
    let password = this.state.password.trim();
    let password2 = this.state.password2.trim();
    let email = this.state.email.trim();

    var valid = true;

    if (!username) {
      NavbarActions.invalidUsername();
      valid = false;
    }

    if (!password) {
      NavbarActions.invalidPassword();
      valid = false;
    }

    if (!password2 || (password != password2)) {
      NavbarActions.invalidPassword2();
      valid = false;
    }

    if (!email || !this.validEmail(email)) {
      NavbarActions.invalidEmail();
      valid = false;
    }

    if (valid) {
      NavbarActions.signup(username, password, email);
    }
  }

  validEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  handleSignout(event) {
    event.preventDefault();

    NavbarActions.signout();
  }

  handleForgot(event) {
    event.preventDefault();

    let email = this.state.email.trim();

    if (email) {
      NavbarActions.forgot(email);
    }
  }

  showLogin(event) {
    event.preventDefault();
    NavbarActions.updateFormState('0');
  }

  showSignup(event) {
    event.preventDefault();
    NavbarActions.updateFormState('1');
  }

  showForgot(event) {
    event.preventDefault();
    NavbarActions.updateFormState('2');
  }

  render() {
    let loginForm = (
      <form ref='loginForm' className='navbar-form animated' onSubmit={this.handleLogin.bind(this)}>
        <input type='text' className='form-control' placeholder='Username' value={this.state.username} onChange={NavbarActions.updateUsername} />
        <input type='password' className='form-control' placeholder='Password' value={this.state.password} onChange={NavbarActions.updatePassword} />
        <button className='btn btn-primary' onClick={this.handleLogin.bind(this)}>Log In</button>
        <a href='#' onClick={this.showSignup.bind(this)}>Don't have an account? Sign up.</a>
        <a href='#' onClick={this.showForgot.bind(this)}>Forgot your password?</a>
      </form>
    );

    let signupForm = (
      <form ref='signupForm' className='navbar-form animated' onSubmit={this.handleSignup.bind(this)}>
        <div className={this.state.usernameValidationState}>
          <input type='text' className='form-control' placeholder='Username' 
              value={this.state.username} 
              onBlur={NavbarActions.checkUsername}
              onChange={NavbarActions.updateUsername} />
        </div>
        <div className={this.state.emailValidationState}>
          <input type='email' className='form-control' placeholder='Email' 
              value={this.state.email} 
              onBlur={NavbarActions.checkEmail}
              onChange={NavbarActions.updateEmail} />
        </div>
        <div className={this.state.passwordValidationState}>
          <input type='password' className='form-control' placeholder='Password' 
              value={this.state.password} 
              onChange={NavbarActions.updatePassword} />
        </div>
        <div className={this.state.password2ValidationState}>
          <input type='password' className='form-control' placeholder='Password (again)' 
              value={this.state.password2} 
              onChange={NavbarActions.updatePassword2} />
        </div>
        <button className='btn btn-primary' onClick={this.handleSignup.bind(this)}>Sign Up</button>
        <a href='#' onClick={this.showLogin.bind(this)}>Already have an account? Log in.</a>
        <a href='#' onClick={this.showForgot.bind(this)}>Forgot your password?</a>
      </form>
    );

    let forgotForm =  (
      <form ref='forgotForm' className='navbar-form animated' onSubmit={this.handleForgot.bind(this)}>
        <input type='email' className='form-control' placeholder='Email' value={this.state.email} onChange={NavbarActions.updateEmail} />
        <button className='btn btn-primary' onClick={this.handleForgot.bind(this)}>Reset Password</button>
        <a href='#' onClick={this.showSignup.bind(this)}>Don't have an account? Sign up.</a>
        <a href='#' onClick={this.showLogin.bind(this)}>Already have an account? Log in.</a>
      </form>
    );

    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='navbar-header'>
          <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>
          <Link to='/' className='navbar-brand'>
            KHUX Medal Clash
          </Link>
        </div>
        <div id='navbar' className='navbar-collapse collapse'>
          <ul className='nav navbar-nav'>
            <li><Link to='/' className='nav-btn'>Clash</Link></li>
            <li><Link to='/stats'>Stats</Link></li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Top 100 <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/medals/top'>Top Overall</Link></li>
                <li className='dropdown-submenu'>
                  <Link to='/medals/top/power'>Power Medals</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/medals/top/power/upright'>Upright Power Medals</Link></li>
                    <li><Link to='/medals/top/power/reversed'>Reversed Power Medals</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/medals/top/speed'>Speed Medals</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/medals/top/speed/upright'>Upright Speed Medals</Link></li>
                    <li><Link to='/medals/top/speed/reversed'>Reversed Speed Medals</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/medals/top/magic'>Magic Medals</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/medals/top/magic/upright'>Upright Magic Medals</Link></li>
                    <li><Link to='/medals/top/magic/reversed'>Reversed Magic Medals</Link></li>
                  </ul>
                </li>
                <li className='divider'></li>
                <li><Link to='/medals/shame'>Hall of Shame</Link></li>
              </ul>
            </li>
            { this.state.user && (this.state.user.admin || this.state.user.contributor) ? (<li><Link to='/add'>Add</Link></li>) : ('') }
          </ul>
          <form ref='searchForm' className='navbar-form navbar-left animated' onSubmit={this.handleSubmit.bind(this)}>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder={this.state.totalMedals + ' medal variations'} value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
              <span className='input-group-btn'>
                <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-search'></span></button>
              </span>
            </div>
          </form>
          <ul className='nav navbar-nav navbar-right'>
            { this.state.user && this.state.user.username ? (
              <li className='dropdown'>
                <a href='#' className='dropdown-toggle' data-toggle='dropdown'>{this.state.user.username} <span className='caret'></span></a>
                <ul className='dropdown-menu'>
                  <li><Link to='/profile'>Profile</Link></li>
                  { this.state.user.contributor ? (<li><Link to='/contributor'>Contributor</Link></li>) : ('') }
                  { this.state.user.admin ? (<li><Link to='/admin'>Admin</Link></li>) : ('') }
                  <li>
                    <form ref='signoutForm' className='navbar-form animated signoutForm' onSubmit={this.handleSignout.bind(this)}>
                      <button className='btn btn-primary' onClick={this.handleSignout.bind(this)}>Sign Out</button>
                    </form>
                  </li>
                </ul>
              </li>
            ) : (
              <li className='dropdown login-signup'>
                <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Login / Signup <span className='caret'></span></a>
                <ul className='dropdown-menu'>
                  <li>
                    { this.state.formState == 0 ? loginForm : ('') }
                    { this.state.formState == 1 ? signupForm : ('') }
                    { this.state.formState == 2 ? forgotForm : ('') }
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}
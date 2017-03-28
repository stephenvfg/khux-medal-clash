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

    $(document).ajaxStart(() => {
      NavbarActions.updateAjaxAnimation('fadeIn');
    });

    $(document).ajaxComplete(() => {
      setTimeout(() => {
        NavbarActions.updateAjaxAnimation('fadeOut');
      }, 750);
    });
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

    if (username && password) {
      NavbarActions.signup(username, password);
    }
  }

  handleSignout(event) {
    event.preventDefault();

    NavbarActions.signout();
  }

  render() {
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
                <li><Link to='/top'>Top Overall</Link></li>
                <li className='dropdown-submenu'>
                  <Link to='/top/power'>Power Medals</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/top/power/upright'>Upright Power Medals</Link></li>
                    <li><Link to='/top/power/reversed'>Reversed Power Medals</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/top/speed'>Speed Medals</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/top/speed/upright'>Upright Speed Medals</Link></li>
                    <li><Link to='/top/speed/reversed'>Reversed Speed Medals</Link></li>
                  </ul>
                </li>
                <li className='dropdown-submenu'>
                  <Link to='/top/magic'>Magic Medals</Link>
                  <ul className='dropdown-menu'>
                    <li><Link to='/top/magic/upright'>Upright Magic Medals</Link></li>
                    <li><Link to='/top/magic/reversed'>Reversed Magic Medals</Link></li>
                  </ul>
                </li>
                <li className='divider'></li>
                <li><Link to='/shame'>Hall of Shame</Link></li>
              </ul>
            </li>
            { this.state.user && this.state.user.admin ? (<li><Link to='/add'>Add</Link></li>) : ('') }
          </ul>
          <form ref='searchForm' className='navbar-form navbar-left animated' onSubmit={this.handleSubmit.bind(this)}>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder={this.state.totalMedals + ' medals'} value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
              <span className='input-group-btn'>
                <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-search'></span></button>
              </span>
            </div>
          </form>
          <ul className='nav navbar-nav'>
            { this.state.user && this.state.user.username ? (
              <li className='dropdown login-signup'>
                <a href='#' className='dropdown-toggle' data-toggle='dropdown'>{this.state.user.username} <span className='caret'></span></a>
                <ul className='dropdown-menu'>
                  <li>
                    <form ref='loginForm' className='navbar-form animated' onSubmit={this.handleSignout.bind(this)}>
                      <div className='input-group'>
                        <span className='input-group-btn'>
                          <button className='btn btn-default' onClick={this.handleSignout.bind(this)}>Sign Out</button>
                        </span>
                      </div>
                    </form>
                  </li>
                </ul>
              </li>
            ) : (
              <li className='dropdown login-signup'>
                <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Login / Signup <span className='caret'></span></a>
                <ul className='dropdown-menu'>
                  <li>
                    <form ref='loginForm' className='navbar-form animated' onSubmit={this.handleLogin.bind(this)}>
                      <div className='input-group'>
                        <input type='text' className='form-control' placeholder='Username' value={this.state.username} onChange={NavbarActions.updateUsername} />
                        <input type='text' className='form-control' placeholder='Password' value={this.state.password} onChange={NavbarActions.updatePassword} />
                        <span className='input-group-btn'>
                          <button className='btn btn-default' onClick={this.handleLogin.bind(this)}>Log In</button>
                        </span>
                      </div>
                    </form>
                  </li>
                  <li>
                    <form ref='signupForm' className='navbar-form animated' onSubmit={this.handleSignup.bind(this)}>
                      <div className='input-group'>
                        <input type='text' className='form-control' placeholder='Username' value={this.state.username} onChange={NavbarActions.updateUsername} />
                        <input type='text' className='form-control' placeholder='Password' value={this.state.password} onChange={NavbarActions.updatePassword} />
                        <input type='text' className='form-control' placeholder='Password (again)' value={this.state.password2} onChange={NavbarActions.updatePassword2} />
                        <span className='input-group-btn'>
                          <button className='btn btn-default' onClick={this.handleSignup.bind(this)}>Sign Up</button>
                        </span>
                      </div>
                    </form>
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
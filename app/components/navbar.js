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
            <li><Link to='/add'>Add</Link></li>
          </ul>
          <form ref='searchForm' className='navbar-form navbar-left animated' onSubmit={this.handleSubmit.bind(this)}>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder={this.state.totalMedals + ' medals'} value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
              <span className='input-group-btn'>
                <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-search'></span></button>
              </span>
            </div>
          </form>
        </div>
      </nav>
    );
  }
}
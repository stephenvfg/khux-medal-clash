import React, { Component } from 'react';
import { Link } from 'react-router';
import { isEqual } from 'underscore';
import NavbarSearchStore from '../stores/navbar_search_store';
import NavbarSearchActions from '../actions/navbar_search_actions';

export default class NavbarSearch extends Component {
  constructor(props) {
    super(props);
    this.state = NavbarSearchStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarSearchStore.listen(this.onChange);

    NavbarSearchActions.findMedals(this.props.searchQuery.trim());
  }

  componentWillUnmount() {
    NavbarSearchStore.unlisten(this.onChange);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.searchQuery, this.props.searchQuery)) {
      NavbarSearchActions.findMedals(this.props.searchQuery.trim());
    }
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let results = this.state.searchResults.map((result, index) => {
      return (
        <li key={result._id}>
          <Link to={'/medal/' + result.slug}>{result.name}</Link>
        </li>
      );
    });

    return (
      <div>
        { (this.state.searchResults.length > 0) ? (
          <div className='dropdown search-results'>
            <ul className='dropdown-menu'>
              <li className='search-count'>
                { this.state.searchResults.length + ' medals found' }
                { this.state.searchResults.length > 49 ? ' - narrow your search' : '' }
              </li>
              { results }
            </ul>
          </div> 
        ) : ('') }
      </div>
    );
  }
}
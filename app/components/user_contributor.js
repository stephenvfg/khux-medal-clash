import React, { Component } from 'react';
import { Link } from 'react-router';
import { isEqual } from 'underscore';
import UserContributorStore from '../stores/user_contributor_store';
import UserContributorActions from '../actions/user_contributor_actions';
import MedalImg from './medal_img';

export default class UserContributor extends Component {
  constructor(props) {
    super(props);
    this.state = UserContributorStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    UserContributorStore.listen(this.onChange);

    UserContributorActions.loggedIn();
  }

  componentWillUnmount() {
    UserContributorStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleActivate(event) {
    event.preventDefault();

    let id = event.target.getAttribute('data-id');
    let active = event.target.value;

    UserContributorActions.activateMedal(id, active);
  }

  render() {
    let medalsList = this.state.medals.map((medal, index) => {
      return (
        <div key={medal._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            <div className='pull-left thumb-lg'>
              <Link to={'/medal/' + medal.slug}>
                <MedalImg isGuilted={medal.isGuilted} isBoosted={medal.isBoosted} 
                    tier={medal.tier} imgPath={medal.imgPath} large='' cl='media-object' dir='thumbs'
                    onClick='' 
                />
              </Link>
            </div>
            <div className='media-body'>
              <h4 className='media-heading'>
                <strong><Link to={'/medal/' + medal.slug}>
                  { medal.name }
                </Link></strong>
              </h4>
              <Link to={'/edit/' + medal.slug} className='btn btn-default'>
                Edit Medal
              </Link>
              <button className='btn btn-default' 
                  data-id={medal._id}
                  value={!medal._active}
                  onClick={this.handleActivate.bind(this)}>
                {medal._active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className='container contributor'>
        <div className='medal-list list-group col-xs-12 col-sm-6'>
          { this.state.user && this.state.user.contributor
            ? (
              <div>
                <div className='panel panel-default flipInX animated'>
                  <div className='panel-heading'>Edit and manage the medals that you've added in the past.</div>
                </div>
                {medalsList}
              </div>
            )
            : (
              <div className='panel panel-default flipInX animated'>
                <div className='panel-heading'>You must be a contributor to access this page.</div>
              </div>
            ) 
          }
        </div>
      </div>
    );
  }
}
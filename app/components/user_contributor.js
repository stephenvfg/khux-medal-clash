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

  render() {
    let medalsList = this.state.medals.map((medal, index) => {
      return (
        <div key={medal._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            <span className='position pull-left'>{index + 1}</span>
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
                  { medal.isGuilted ? (' (Guilted)') : ('') }
                  { medal.isBoosted ? (' (Boosted)') : ('') }
                </Link></strong>
              </h4>
              <h4>Wins: <strong>{medal.wins}</strong></h4>
              <h4>Losses: <strong>{medal.losses}</strong></h4>
              <h4>Rate: <strong>{(medal.ratio*100).toFixed(1) + '%'}</strong></h4>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        <div className='medal-list list-group col-xs-12 col-sm-6'>
          {medalsList}
        </div>
      </div>
    );
  }
}
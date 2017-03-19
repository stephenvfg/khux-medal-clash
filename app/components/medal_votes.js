import React, { Component } from 'react';
import { Link } from 'react-router';
import { isEqual } from 'underscore';
import MedalVotesStore from '../stores/medal_votes_store';
import MedalVotesActions from '../actions/medal_votes_actions';
import MedalVotesItem from './medal_votes_item';

export default class MedalVotes extends Component {
  constructor(props) {
    super(props);
    this.state = MedalVotesStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    MedalVotesStore.listen(this.onChange);
    MedalVotesActions.getMedalVotes(this.props.medalId);
  }

  componentWillUnmount() {
    MedalVotesStore.unlisten(this.onChange);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.medalId, this.props.medalId)) {
      MedalVotesActions.getMedalVotes(this.props.medalId);
    }
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let votesList = this.state.votes.map((vote, index) => {
      return (
        <div key={vote._id} className={ vote.winner == this.props.medalId 
              ? 'list-group-item animated fadeIn vote-winner'
              : 'list-group-item animated fadeIn vote-loser' }>
          <div className='media'>
            <div className='media-body'> 
              { this.state.vMedals[index] ? (
                  <MedalVotesItem voteId={vote._id} 
                      winner={this.state.vMedals[index].winner} 
                      loser={this.state.vMedals[index].loser} 
                      currentMedalWon={vote.winner == this.props.medalId} />
                ) : ('Loading...') }
            </div>
          </div>
        </div>
      );
    }, this);

    return (
      <div className='medal-list medal-votes list-group'>
        {votesList}
      </div>
    );
  }
}